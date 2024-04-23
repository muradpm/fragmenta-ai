"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { FormCard } from "@/components/form-card";

import { EmptyHomeState } from "./empty-home-state";

import { NewFormButton } from "@/components/new-form-button";

interface FormListProps {
  orgId: string;
}

export const FormList = ({ orgId }: FormListProps) => {
  const data = useQuery(api.forms.get, { orgId });

  if (data === undefined) return <div>Loading...</div>;

  if (!data?.length) {
    return <EmptyHomeState />;
  }

  return (
    <div>
      <NewFormButton orgId={orgId} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        {data?.map((form) => (
          <FormCard
            key={form._id}
            id={form._id}
            title={form.title}
            authorId={form.authorId}
            authorName={form.authorName}
            createdAt={form._creationTime}
            orgId={form.orgId}
            isPublished={form.isPublished}
          />
        ))}
      </div>
    </div>
  );
};
