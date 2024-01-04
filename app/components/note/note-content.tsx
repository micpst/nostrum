import { sanitize } from "dompurify";
import { parseReferences } from "nostr-tools";
import type { Event } from "nostr-tools";
import { parseImages, parseLinks, parseTags } from "@/app/lib/utils/parsers";
import ImagePreview from "@/app/components/input/image-preview";

type NoteContentProps = {
  event: Event;
};

function NoteContent({ event }: NoteContentProps): JSX.Element {
  const references = parseReferences(event);
  const images = parseImages(event.content);
  const links = parseLinks(event.content);
  const tags = parseTags(event.content);

  let augmentedContent = event.content;

  references.forEach((reference) => {
    let { text, profile, event, address } = reference;
    // let augmentedReference = profile
    //   ? `<strong>@test</strong>`
    //   : event
    //   ? `<em>${eventsCache[event.id].content.slice(0, 5)}</em>`
    //   : address
    //   ? `<a href="${text}">[link]</a>`
    //   : text;
    augmentedContent.replaceAll(text, "");
  });

  images.forEach((image) => {
    augmentedContent = augmentedContent.replaceAll(image, "");
  });

  links.forEach((link) => {
    augmentedContent = augmentedContent.replaceAll(
      link,
      `<a class="text-main-accent hover:underline" href=${link}>${link}</a>`
    );
  });

  tags.forEach((tag) => {
    augmentedContent = augmentedContent.replaceAll(
      tag,
      `<a class="text-main-accent hover:underline" href="#">${tag}</a>`
    );
  });

  augmentedContent = augmentedContent.trim();

  const imagesPreview = images.map((image) => ({
    id: image,
    src: image,
    alt: image,
  }));

  return (
    <>
      <p
        className="whitespace-pre-line break-words"
        dangerouslySetInnerHTML={{ __html: sanitize(augmentedContent) }}
      />
      <div className="mt-1 flex flex-col gap-2">
        {imagesPreview.length ? (
          <ImagePreview imagesPreview={imagesPreview} />
        ) : null}
      </div>
    </>
  );
}

export default NoteContent;
