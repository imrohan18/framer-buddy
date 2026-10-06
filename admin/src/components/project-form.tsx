import { Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PROJECT_CATEGORIES } from "../lib/cms/categories";
import {
  createProjectFn,
  removeProjectImageFn,
  updateProjectFn,
  uploadProjectImageFn,
} from "../lib/cms/server-fns";
import { slugify } from "../lib/cms/sanitize";
import type { CmsProject } from "../lib/cms/types";

type ProjectFormProps = {
  mode: "create" | "edit";
  initialProject?: CmsProject | null;
  onSaved: (project: CmsProject) => void;
};

type FormState = {
  title: string;
  slug: string;
  category: (typeof PROJECT_CATEGORIES)[number];
  shortDescription: string;
  description: string;
  mainImage: string | null;
  thumbnailImage: string | null;
  mobileImage: string | null;
  galleryImages: string[];
  technologies: string[];
  projectUrl: string;
  caseStudyUrl: string;
  githubUrl: string;
  clientName: string;
  year: string;
  featured: boolean;
  status: "draft" | "published";
  displayOrder: string;
};

function toFormState(project?: CmsProject | null): FormState {
  if (!project) {
    return {
      title: "",
      slug: "",
      category: "Website",
      shortDescription: "",
      description: "",
      mainImage: null,
      thumbnailImage: null,
      mobileImage: null,
      galleryImages: [],
      technologies: [],
      projectUrl: "",
      caseStudyUrl: "",
      githubUrl: "",
      clientName: "",
      year: "",
      featured: false,
      status: "draft",
      displayOrder: "100",
    };
  }

  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    shortDescription: project.shortDescription,
    description: project.description,
    mainImage: project.mainImage,
    thumbnailImage: project.thumbnailImage,
    mobileImage: project.mobileImage,
    galleryImages: project.galleryImages,
    technologies: project.technologies,
    projectUrl: project.projectUrl ?? "",
    caseStudyUrl: project.caseStudyUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    clientName: project.clientName ?? "",
    year: project.year ? String(project.year) : "",
    featured: project.featured,
    status: project.status,
    displayOrder: String(project.displayOrder),
  };
}

export function ProjectForm({ mode, initialProject, onSaved }: ProjectFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialProject));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    setForm(toFormState(initialProject));
    setSlugTouched(mode === "edit");
    setDirty(false);
    setMessage(null);
  }, [initialProject, mode]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty || saving) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, saving]);

  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    if (form.title.trim().length < 3) {
      issues.push("Project name must be at least 3 characters.");
    }
    if (form.slug.trim().length < 2) {
      issues.push("Slug must be at least 2 characters.");
    }
    if (form.shortDescription.trim().length < 24) {
      issues.push(
        `Short description must be at least 24 characters (currently ${form.shortDescription.trim().length}).`,
      );
    }
    if (form.description.trim().length < 24) {
      issues.push(
        `Full description must be at least 24 characters (currently ${form.description.trim().length}).`,
      );
    }
    if (form.technologies.length === 0) {
      issues.push("Add at least one technology tag.");
    }
    return issues;
  }, [form]);

  const canSubmit = validationIssues.length === 0;

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
    setDirty(true);
  };

  const addTechnology = () => {
    const cleaned = tagInput.trim();
    if (!cleaned) return;
    if (form.technologies.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      setTagInput("");
      return;
    }
    updateField("technologies", [...form.technologies, cleaned]);
    setTagInput("");
  };

  const removeTechnology = (value: string) => {
    updateField(
      "technologies",
      form.technologies.filter((tag) => tag !== value),
    );
  };

  const handleUpload = async (
    variant: "main" | "thumbnail" | "mobile" | "gallery",
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;

    setUploading(variant);
    setMessage(null);

    try {
      if (variant === "gallery") {
        const uploadedPaths: string[] = [];
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("variant", variant);
          formData.append("file", file);
          const uploaded = await uploadProjectImageFn({ data: formData });
          uploadedPaths.push(uploaded.path);
        }
        updateField("galleryImages", [...form.galleryImages, ...uploadedPaths]);
      } else {
        const file = files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("variant", variant);
        formData.append("file", file);
        const uploaded = await uploadProjectImageFn({ data: formData });

        if (variant === "main") updateField("mainImage", uploaded.path);
        if (variant === "thumbnail") updateField("thumbnailImage", uploaded.path);
        if (variant === "mobile") updateField("mobileImage", uploaded.path);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Image upload failed.",
      });
    } finally {
      setUploading(null);
    }
  };

  const removeImage = async (
    imageKind: "main" | "thumbnail" | "mobile" | "gallery",
    imagePath: string,
  ) => {
    if (mode === "edit" && initialProject?.id) {
      try {
        await removeProjectImageFn({
          data: {
            id: initialProject.id,
            imagePath,
            imageKind,
          },
        });
      } catch {
        // Keep local state update as fallback if immediate delete API fails.
      }
    }

    if (imageKind === "main") updateField("mainImage", null);
    if (imageKind === "thumbnail") updateField("thumbnailImage", null);
    if (imageKind === "mobile") updateField("mobileImage", null);
    if (imageKind === "gallery") {
      updateField(
        "galleryImages",
        form.galleryImages.filter((path) => path !== imagePath),
      );
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || saving) return;

    setSaving(true);
    setMessage(null);

    const yearValue = form.year.trim();
    const displayOrderNumber = Number.parseInt(form.displayOrder.trim(), 10);

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug) || slugify(form.title),
      category: form.category,
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      mainImage: form.mainImage,
      thumbnailImage: form.thumbnailImage,
      mobileImage: form.mobileImage,
      galleryImages: form.galleryImages,
      technologies: form.technologies,
      projectUrl: form.projectUrl.trim(),
      caseStudyUrl: form.caseStudyUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      clientName: form.clientName.trim(),
      year: yearValue ? Number.parseInt(yearValue, 10) : null,
      featured: form.featured,
      status: form.status,
      displayOrder: Number.isFinite(displayOrderNumber) ? displayOrderNumber : 100,
    };

    try {
      const savedProject =
        mode === "edit" && initialProject?.id
          ? await updateProjectFn({ data: { id: initialProject.id, input: payload } })
          : await createProjectFn({ data: payload });

      setDirty(false);
      setMessage({
        type: "success",
        text:
          savedProject.status === "published"
            ? "Project published successfully."
            : "Project saved successfully.",
      });
      onSaved(savedProject);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save project.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      {message ? (
        <div className={`admin-form-message ${message.type === "success" ? "is-success" : "is-error"}`}>
          {message.text}
        </div>
      ) : null}

      <section className="admin-card">
        <h2>Project Details</h2>
        <div className="admin-form-grid two-col">
          <label>
            <span>Project Name</span>
            <input
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Project Management Platform"
              required
            />
          </label>

          <label>
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateField("slug", slugify(event.target.value));
              }}
              placeholder="project-management-platform"
              required
            />
          </label>

          <label>
            <span>Category</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value as FormState["category"])}>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Year</span>
            <input
              value={form.year}
              onChange={(event) => updateField("year", event.target.value)}
              placeholder="2026"
              inputMode="numeric"
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value as "draft" | "published")}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label>
            <span>Display Order</span>
            <input
              value={form.displayOrder}
              onChange={(event) => updateField("displayOrder", event.target.value)}
              inputMode="numeric"
            />
          </label>

          <label className="admin-checkbox-row">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField("featured", event.target.checked)}
            />
            <span>Mark as Featured (primary)</span>
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Descriptions</h2>
        <div className="admin-form-grid">
          <label>
            <span>Short Description</span>
            <textarea
              value={form.shortDescription}
              onChange={(event) => updateField("shortDescription", event.target.value)}
              rows={3}
              minLength={24}
              required
            />
            <small
              className={`admin-field-hint ${form.shortDescription.trim().length < 24 ? "is-warning" : "is-ok"}`}
            >
              {form.shortDescription.trim().length < 24
                ? `${24 - form.shortDescription.trim().length} more characters needed (min 24).`
                : `${form.shortDescription.trim().length} characters`}
            </small>
          </label>

          <label>
            <span>Full Description (Markdown supported)</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              rows={8}
              minLength={24}
              required
            />
            <small
              className={`admin-field-hint ${form.description.trim().length < 24 ? "is-warning" : "is-ok"}`}
            >
              {form.description.trim().length < 24
                ? `${24 - form.description.trim().length} more characters needed (min 24).`
                : `${form.description.trim().length} characters`}
            </small>
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Project Images</h2>
        <p className="admin-help-text">
          Upload JPG, PNG, or WEBP files. Max size: 8MB per image.
        </p>

        <div className="admin-image-grid">
          {[
            { key: "main", label: "Main Project Image", value: form.mainImage },
            { key: "thumbnail", label: "Project Thumbnail", value: form.thumbnailImage },
            { key: "mobile", label: "Mobile Screenshot", value: form.mobileImage },
          ].map((item) => (
            <div className="admin-image-card" key={item.key}>
              <p>{item.label}</p>

              {item.value ? (
                <div className="admin-image-preview-wrap">
                  <img src={item.value} alt={`${item.label} preview`} className="admin-image-preview" />
                  <button
                    type="button"
                    className="admin-chip danger"
                    onClick={() => removeImage(item.key as "main" | "thumbnail" | "mobile", item.value!)}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              ) : (
                <label className="admin-upload-box">
                  <Upload size={14} />
                  <span>{uploading === item.key ? "Uploading..." : "Upload image"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => void handleUpload(item.key as "main" | "thumbnail" | "mobile", event.target.files)}
                    hidden
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="admin-image-card" style={{ marginTop: 16 }}>
          <p>Gallery Images</p>

          {form.galleryImages.length > 0 ? (
            <div className="admin-gallery-grid">
              {form.galleryImages.map((imagePath) => (
                <div key={imagePath} className="admin-gallery-item">
                  <img src={imagePath} alt="Gallery preview" className="admin-image-preview" />
                  <button
                    type="button"
                    className="admin-chip danger"
                    onClick={() => removeImage("gallery", imagePath)}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-help-text">No gallery images uploaded yet.</p>
          )}

          <label className="admin-upload-box" style={{ marginTop: 12 }}>
            <Plus size={14} />
            <span>{uploading === "gallery" ? "Uploading..." : "Add gallery images"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(event) => void handleUpload("gallery", event.target.files)}
              hidden
            />
          </label>
        </div>
      </section>

      <section className="admin-card">
        <h2>Technologies</h2>
        <div className="admin-tag-input-row">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="React, Node.js, MongoDB"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addTechnology();
              }
            }}
          />
          <button type="button" className="admin-chip" onClick={addTechnology}>
            <Plus size={13} /> Add
          </button>
        </div>

        <div className="admin-tag-list">
          {form.technologies.map((tag) => (
            <button type="button" className="admin-tag" key={tag} onClick={() => removeTechnology(tag)}>
              <span>{tag}</span>
              <X size={13} />
            </button>
          ))}
        </div>
        {form.technologies.length === 0 ? (
          <small className="admin-field-hint is-warning">
            Add at least one technology (e.g. type a name and press Enter).
          </small>
        ) : null}
      </section>

      <section className="admin-card">
        <h2>Optional Links</h2>
        <div className="admin-form-grid two-col">
          <label>
            <span>Project URL</span>
            <input value={form.projectUrl} onChange={(event) => updateField("projectUrl", event.target.value)} />
          </label>

          <label>
            <span>Case Study URL</span>
            <input
              value={form.caseStudyUrl}
              onChange={(event) => updateField("caseStudyUrl", event.target.value)}
            />
          </label>

          <label>
            <span>GitHub URL</span>
            <input value={form.githubUrl} onChange={(event) => updateField("githubUrl", event.target.value)} />
          </label>

          <label>
            <span>Client Name</span>
            <input value={form.clientName} onChange={(event) => updateField("clientName", event.target.value)} />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        {!canSubmit && (dirty || mode === "create") ? (
          <div className="admin-requirements" role="status">
            <p className="admin-requirements-title">
              Complete these before saving ({validationIssues.length} remaining):
            </p>
            <ul>
              {validationIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <button type="submit" className="admin-primary-btn" disabled={!canSubmit || saving}>
          {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />}
          <span>
            {saving
              ? "Saving..."
              : form.status === "published"
                ? "Save and Publish"
                : mode === "create"
                  ? "Create Project"
                  : "Save Changes"}
          </span>
        </button>
      </div>
    </form>
  );
}
