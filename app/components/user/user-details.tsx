import UserName from "@/app/components/user/user-name";
import { nip19 } from "nostr-tools";
import { shortenHash } from "@/app/lib/utils";

function UserDetails({
  pubkey,
  nip05,
  about,
  name,
  displayName,
  display_name,
  website,
  verified,
  createdAt,
  following,
  followers,
}: any): JSX.Element {
  // const detailIcons: Readonly<DetailIcon[]> = [
  //   [location, "MapPinIcon"],
  //   [website, "LinkIcon"],
  //   [`Joined ${formatDate(createdAt, "joined")}`, "CalendarDaysIcon"],
  // ];
  const npub = nip19.npubEncode(pubkey);
  const shortNpub = shortenHash(npub, 10);

  return (
    <>
      <div>
        <UserName
          className="-mb-1 text-xl"
          iconClassName="w-6 h-6"
          name={name || displayName || display_name}
          verified={verified}
        />
        <div className="flex items-center gap-1 text-light-secondary">
          {verified ? <p>@{nip05.split("@")[1]}</p> : <p>@{shortNpub}</p>}
          {/*<UserFollowing userTargetId={id} />*/}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {about ? (
          <p className="whitespace-pre-line break-words">{about}</p>
        ) : undefined}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary dark:text-dark-secondary">
          {/*{detailIcons.map(*/}
          {/*  ([detail, icon], index) =>*/}
          {/*    detail && (*/}
          {/*      <div className="flex items-center gap-1" key={icon}>*/}
          {/*        <i>*/}
          {/*          <HeroIcon className="h-5 w-5" iconName={icon} />*/}
          {/*        </i>*/}
          {/*        {index === 1 ? (*/}
          {/*          <a*/}
          {/*            className="custom-underline text-main-accent"*/}
          {/*            href={`https://${detail}`}*/}
          {/*            target="_blank"*/}
          {/*            rel="noreferrer"*/}
          {/*          >*/}
          {/*            {detail}*/}
          {/*          </a>*/}
          {/*        ) : index === 2 ? (*/}
          {/*          <button className="custom-underline group relative">*/}
          {/*            {detail}*/}
          {/*            <ToolTip*/}
          {/*              className="translate-y-1"*/}
          {/*              tip={formatDate(createdAt, "full")}*/}
          {/*            />*/}
          {/*          </button>*/}
          {/*        ) : (*/}
          {/*          <p>{detail}</p>*/}
          {/*        )}*/}
          {/*      </div>*/}
          {/*    )*/}
          {/*)}*/}
        </div>
      </div>
      {/*<UserFollowStats following={following} followers={followers} />*/}
    </>
  );
}

export default UserDetails;
