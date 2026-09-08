"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage, projectsApi, type Project } from "@/lib/api";
import { FormShell } from "@/components/admin/FormShell";
import { FieldShell, TextInput, TextAreaInput } from "@/components/admin/Field";
import { StringListField } from "@/components/admin/StringListField";
import { NeonButton } from "@/components/cyber/NeonButton";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/admin/Toast";

const schema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  link: z.string().optional(),
  githubLink: z.string().optional(),
  youtubeLink: z.string().optional(),
  twitterLink: z.string().optional(),
  instagramLink: z.string().optional(),
  facebookLink: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  collaborators: z.array(z.string()).default([]),
});
type FormData = z.infer<typeof schema>;

function nullify(value?: string): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      titleEn: initial?.titleEn ?? "",
      description: initial?.description ?? "",
      descriptionEn: initial?.descriptionEn ?? "",
      link: initial?.link ?? "",
      githubLink: initial?.githubLink ?? "",
      youtubeLink: initial?.youtubeLink ?? "",
      twitterLink: initial?.twitterLink ?? "",
      instagramLink: initial?.instagramLink ?? "",
      facebookLink: initial?.facebookLink ?? "",
      technologies: initial?.technologies ?? [],
      images: initial?.images ?? [],
      collaborators: initial?.collaborators ?? [],
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const payload = {
        title: values.title,
        titleEn: values.titleEn?.trim() ? values.titleEn : null,
        description: values.description,
        descriptionEn: values.descriptionEn?.trim() ? values.descriptionEn : null,
        link: nullify(values.link),
        githubLink: nullify(values.githubLink),
        youtubeLink: nullify(values.youtubeLink),
        twitterLink: nullify(values.twitterLink),
        instagramLink: nullify(values.instagramLink),
        facebookLink: nullify(values.facebookLink),
        technologies: values.technologies,
        images: values.images,
        collaborators: values.collaborators,
      };
      if (initial) {
        await projectsApi.update(initial.id, payload);
        toast.push("projeto atualizado");
      } else {
        await projectsApi.create(payload);
        toast.push("projeto criado");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  });

  return (
    <FormShell
      onSubmit={onSubmit}
      error={error}
      footer={
        <>
          <NeonButton
            type="submit"
            variant="cyan"
            iconLeft={<Save className="h-4 w-4" />}
            loading={isSubmitting}
          >
            {initial ? "salvar" : "criar"}
          </NeonButton>
          <Link href="/admin/projects">
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
        <TextInput {...register("title")} placeholder="Nome do projeto" />
      </FieldShell>
      <FieldShell label="title (en)"
        hint="tradução EN; vazio = o site cai no português">
        <TextInput {...register("titleEn")} placeholder="Nome do projeto" />
      </FieldShell>
      <FieldShell label="description" error={errors.description?.message} required>
        <TextAreaInput
          {...register("description")}
          placeholder="O que é, problema que resolve, stack utilizada..."
          rows={6}
        />
      </FieldShell>
      <FieldShell label="description (en)"
        hint="tradução EN; vazio = o site cai no português">
        <TextAreaInput
          {...register("descriptionEn")}
          placeholder="O que é, problema que resolve, stack utilizada..."
          rows={6}
        />
      </FieldShell>

      <div className="grid gap-5 md:grid-cols-2">
        <FieldShell label="link (live)">
          <TextInput {...register("link")} placeholder="https://..." />
        </FieldShell>
        <FieldShell label="github">
          <TextInput
            {...register("githubLink")}
            placeholder="https://github.com/..."
          />
        </FieldShell>
        <FieldShell label="youtube">
          <TextInput {...register("youtubeLink")} placeholder="https://youtube.com/..." />
        </FieldShell>
        <FieldShell label="twitter / x">
          <TextInput {...register("twitterLink")} placeholder="https://x.com/..." />
        </FieldShell>
        <FieldShell label="instagram">
          <TextInput
            {...register("instagramLink")}
            placeholder="https://instagram.com/..."
          />
        </FieldShell>
        <FieldShell label="facebook">
          <TextInput {...register("facebookLink")} placeholder="https://facebook.com/..." />
        </FieldShell>
      </div>

      <Controller
        control={control}
        name="technologies"
        render={({ field }) => (
          <FieldShell label="technologies" hint="enter para adicionar">
            <StringListField
              value={field.value}
              onChange={field.onChange}
              placeholder="ex: TypeScript"
            />
          </FieldShell>
        )}
      />

      <Controller
        control={control}
        name="images"
        render={({ field }) => (
          <FieldShell label="images (URLs)" hint="primeira imagem vira capa">
            <StringListField
              value={field.value}
              onChange={field.onChange}
              placeholder="https://..."
            />
          </FieldShell>
        )}
      />

      <Controller
        control={control}
        name="collaborators"
        render={({ field }) => (
          <FieldShell label="collaborators">
            <StringListField
              value={field.value}
              onChange={field.onChange}
              placeholder="@usuario"
            />
          </FieldShell>
        )}
      />
    </FormShell>
  );
}
