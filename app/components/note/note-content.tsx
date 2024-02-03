import DOMPurify from "isomorphic-dompurify";
import * as linkify from "linkifyjs";
import "linkify-plugin-hashtag";
import Link from "next/link";
import { nip19, parseReferences } from "nostr-tools";
import ReactPlayer from "react-player";
import type { Event } from "nostr-tools";
import type { JSX } from "react";
import ImagePreview from "@/app/components/input/image-preview";
import { validateImageUrl, validateVideoUrl } from "@/app/lib/utils/validators";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if ("target" in node) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener");
  }
});

interface INoteContentProps {
  event: Event;
  expanded?: boolean;
}

function NoteContent({ event, expanded }: INoteContentProps): JSX.Element {
  const references = parseReferences(event);

  const links = linkify
    .find(event.content, { truncate: 42 })
    .filter((link) => link.type === "url");

  const hashtags = linkify
    .find(event.content, {
      formatHref: {
        hashtag: (href) => `/t/${href.substring(1).toLowerCase()}`,
      },
    })
    .filter((link) => link.type === "hashtag");

  const images = links.filter((link) => validateImageUrl(link.href));
  const videos = links.filter((link) => validateVideoUrl(link.href));

  let augmentedContent = event.content;

  references.forEach((reference) => {
    const { text, profile, event, address } = reference;
    // let augmentedReference = profile
    //   ? `<strong>@test</strong>`
    //   : event
    //   ? `<em>${eventsCache[event.id].content.slice(0, 5)}</em>`
    //   : address
    //   ? `<a href="${text}">[link]</a>`
    //   : text;
    augmentedContent = augmentedContent.replaceAll(text, "");
  });

  images.forEach((image) => {
    augmentedContent = augmentedContent.replaceAll(image.href, "");
  });

  videos.forEach((video) => {
    augmentedContent = augmentedContent.replaceAll(video.href, "");
  });

  links.forEach((link) => {
    augmentedContent = augmentedContent.replaceAll(
      link.href,
      `<a class="text-main-accent hover:underline" href=${link.href} target="_blank">${link.value}</a>`,
    );
  });

  hashtags.forEach((hashtag) => {
    augmentedContent = augmentedContent.replaceAll(
      hashtag.value,
      `<a class="text-main-accent hover:underline" href=${hashtag.href}>${hashtag.value}</a>`,
    );
  });

  augmentedContent = augmentedContent.trim();

  const imagesPreview = images.map((image) => ({
    id: image.href,
    src: image.href,
    alt: "Note image preview.",
  }));

  const videosUrls = videos.map((video) => video.href);

  const truncate = augmentedContent.length > 300 && !expanded;

  augmentedContent = truncate
    ? `${augmentedContent.slice(0, 250)}...`
    : augmentedContent;

  return (
    <>
      <p
        onClick={(e) => e.stopPropagation()}
        className="whitespace-pre-line break-words"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(augmentedContent),
        }}
      />
      {truncate && (
        <Link
          href={`/n/${nip19.noteEncode(event.id)}`}
          className="hover:underline w-full py-3 text-main-accent"
        >
          Show more
        </Link>
      )}
      <div className="mt-1 flex flex-col gap-2">
        {imagesPreview.length ? (
          <ImagePreview imagesPreview={imagesPreview} />
        ) : null}
        {videos.length ? (
          <ReactPlayer
            className="video-player"
            width=""
            height=""
            controls
            url={videosUrls}
          />
        ) : null}
      </div>
    </>
  );
}

export default NoteContent;
