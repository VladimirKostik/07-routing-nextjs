import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getNotesByQuery, NoteTag } from "@/lib/api";
import NotesClient from "./Notes.client";

interface Props {
params: Promise<{
slug?: string[];
}>;
}

export default async function NotesByCategory({ params }: Props) {
const resolvedParams = await params;

const category = (resolvedParams.slug?.[0] as NoteTag) ?? undefined;
const page = 1;

const queryClient = new QueryClient();

await queryClient.prefetchQuery({
queryKey: ["notes", "", category ?? "", page],
queryFn: () => getNotesByQuery("", page, category),
});

const dehydratedState = dehydrate(queryClient);

return ( <HydrationBoundary state={dehydratedState}> <NotesClient tag={category} /> </HydrationBoundary>
);
}