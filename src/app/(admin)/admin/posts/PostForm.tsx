"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  categoriesApi,
  extractErrorMessage,
  postsApi,
  type Post,
} from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import {
  FieldShell,
  TextInput,
  TextAreaInput,
  SelectInput,
} from "@/components/admin/Field";
import { StringListField } from "@/components/admin/StringListField";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  slug: z.string().optional().default(""),
  summary: z.string().min(1),
  summaryEn: z.string().optional(),
  content: z.string().min(1),
  contentEn: z.string().optional(),
  categoryId: z.coerce.number().int().positive(),
  images: z.array(z.string()).default([]),
  publishedAt: z.string().optional().default(""),
});
type FormData = z.infer<typeof schema>;

function toDateTimeInput(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostForm({ initial }: { initial?: Post }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      titleEn: initial?.titleEn ?? "",
      slug: initial?.slug ?? "",
      summary: initial?.summary ?? "",
      summaryEn: initial?.summaryEn ?? "",
      content: initial?.content ?? "",
      contentEn: initial?.contentEn ?? "",
      categoryId: initial?.categoryId ?? 0,
      images: initial?.images ?? [],
      publishedAt: toDateTimeInput(initial?.publishedAt),
    },
  });

  const title = watch("title");

  function buildPayload(values: FormData) {
    const slug = (values.slug?.trim() || slugify(values.title)).toLowerCase();
    return {
      title: values.title,
      titleEn: values.titleEn?.trim() ? values.titleEn : null,
      slug,
      summary: values.summary,
      summaryEn: values.summaryEn?.trim() ? values.summaryEn : null,
      content: values.content,
      contentEn: values.contentEn?.trim() ? values.contentEn : null,
      categoryId: values.categoryId,
      images: values.images,
    };
  }

  const onSaveDraft = handleSubmit(async (values) => {
    setError(null);
    try {
      const payload = { ...buildPayload(values), publishedAt: null };
      if (initial) {
        await postsApi.update(initial.id, payload);
        toast.push("draft salvo");
      } else {
        const created = await postsApi.create(payload);
        toast.push("draft criado");
        router.push(`/admin/posts/${created.id}/edit`);
        router.refresh();
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  });

  const onSavePublished = handleSubmit(async (values) => {
    setError(null);
    try {
      const publishedAt = values.publishedAt
        ? new Date(values.publishedAt).toISOString()
        : new Date().toISOString();
      const payload = { ...buildPayload(values), publishedAt };
      let id = initial?.id;
      if (initial) {
        await postsApi.update(initial.id, payload);
      } else {
        const created = await postsApi.create(payload);
        id = created.id;
      }
      if (id) await postsApi.publish(id);
      toast.push("post publicado");
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  });

  return (
    <FormShell
      onSubmit={onSavePublished}
      error={error}
      footer={
        <>
          <NeonButton
            type="submit"
            variant="magenta"
            iconLeft={<Eye className="h-4 w-4" />}
            loading={isSubmitting}
          >
            {initial?.isPublished ? "salvar publicado" : "publicar"}
          </NeonButton>
          <NeonButton
            type="button"
            variant="cyan"
            iconLeft={
              initial?.isPublished ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )
            }
            onClick={onSaveDraft}
            loading={isSubmitting}
          >
            {initial?.isPublished ? "voltar p/ draft" : "salvar draft"}
          </NeonButton>
          <Link href="/admin/posts">
            <NeonButton
              type="button"
              variant="ghost"
              iconLeft={<ArrowLeft className="h-4 w-4" />}
            >
              cancelar
            </NeonButton>
          </Link>
        </>
      }
    >
      <FieldShell label="title" error={errors.title?.message} required>
        <TextInput
          {...register("title")}
          placeholder="Título do post"
          onBlur={() => {
            const current = getValues("slug");
            if (!current && title) {
              setValue("slug", slugify(title), { shouldDirty: true });
            }
          }}
        />
      </FieldShell>

      <FieldShell
        label="title (en)"
        hint="tradução EN; vazio = o site cai no português"
      >
        <TextInput {...register("titleEn")} placeholder="Post title" />
      </FieldShell>

      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell
          label="slug"
          error={errors.slug?.message}
          hint="vazio = gerado a partir do title"
        >
          <TextInput {...register("slug")} placeholder="meu-post" />
        </FieldShell>
        <FieldShell
          label="category"
          error={errors.categoryId?.message}
          required
          hint={
            (categories?.length ?? 0) === 0
              ? "nenhuma categoria criada — adicione em /admin/categories"
              : undefined
          }
        >
          <SelectInput
            {...register("categoryId")}
            options={[
              { value: 0, label: "selecione..." },
              ...(categories ?? []).map((c) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />
        </FieldShell>
      </div>

      <FieldShell label="summary" error={errors.summary?.message} required>
        <TextAreaInput
          {...register("summary")}
          rows={3}
          placeholder="Resumo curto (1-2 linhas) que aparece no card do blog"
        />
      </FieldShell>

      <FieldShell
        label="summary (en)"
        hint="tradução EN; vazio = o site cai no português"
      >
        <TextAreaInput
          {...register("summaryEn")}
          rows={3}
          placeholder="Short summary shown on the blog card"
        />
      </FieldShell>

      <Controller
        control={control}
        name="content"
        render={({ field, fieldState }) => (
          <FieldShell
            label="content (markdown)"
            error={fieldState.error?.message}
            required
            hint="suporta GFM, código com syntax highlight, listas, tabelas"
          >
            <MarkdownEditor value={field.value} onChange={field.onChange} />
          </FieldShell>
        )}
      />

      <Controller
        control={control}
        name="contentEn"
        render={({ field }) => (
          <FieldShell
            label="content (en, markdown)"
            hint="tradução EN; vazio = o site cai no português"
          >
            <MarkdownEditor
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          </FieldShell>
        )}
      />

      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <FieldShell label="images" hint="envie ou cole URLs; primeira imagem vira capa">
            <StringListField
              value={field.value}
              onChange={field.onChange}
              placeholder="https://..."
              extra={
                <ImageUploadButton
                  multiple
                  onUploaded={(urls) => field.onChange([...field.value, ...urls])}
                />
              }
            />
          </FieldShell>
        )}
      />

      <FieldShell
        label="publishedAt"
        hint="usado se você publicar agora; deixe vazio para usar agora"
        error={errors.publishedAt?.message}
      >
        <TextInput type="datetime-local" {...register("publishedAt")} />
      </FieldShell>
    </FormShell>
  );
}
