import type { Metadata } from "next";
import ModelPage from "../../_lib/ModelPage";
import { buildModelMetadata } from "../../_lib/dev-meta";
import { DEVS } from "../../_lib/dev-content";
import { getModelStaticParams } from "../../_lib/model-utils";

const DEV_SLUG = "lirios-residencial-2" as const;

export function generateStaticParams() {
  return getModelStaticParams(DEVS[DEV_SLUG].name);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ modelo: string }>;
}): Promise<Metadata> {
  const { modelo } = await params;
  return buildModelMetadata(DEV_SLUG, modelo);
}

export default async function Page({
  params,
}: {
  params: Promise<{ modelo: string }>;
}) {
  const { modelo } = await params;
  return <ModelPage devSlug={DEV_SLUG} modeloSlug={modelo} />;
}
