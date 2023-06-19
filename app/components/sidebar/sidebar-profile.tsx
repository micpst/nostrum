"use client";

import cn from "clsx";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { nip19 } from "nostr-tools";
import { Menu } from "@headlessui/react";
import CustomIcon from "@/app/components/ui/icon";
import UserAvatar from "@/app/components/user/user-avatar";
import UserName from "@/app/components/user/user-name";
import UserNpub from "@/app/components/user/user-npub";
import { useAuth } from "@/app/lib/context/auth-provider";
import { useProfile } from "@/app/lib/context/profile-provider";

export const variants: Variants = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.2 },
  },
  exit: { opacity: 0, y: 0, transition: { duration: 0.2 } },
};

function SidebarProfile(): JSX.Element | null {
  const { publicKey, logout } = useAuth();
  const { profiles } = useProfile();

  if (!publicKey) return null;

  const user = profiles?.get(publicKey);

  return (
    <>
      <Menu as="div" className="relative inline-block text-left ">
        <Menu.Button
          className={cn(
            `rounded-full p-3 my-2.5 dark-bg-tab flex gap-6 items-center xl:w-60
                 justify-between hover:bg-gray-100 active:bg-gray-100 bg-dark-primary/10`
          )}
        >
          <div className="flex gap-3 truncate">
            <UserAvatar src={user?.picture} size={40} />
            <div className="hidden truncate text-start leading-5 xl:block">
              {user && (
                <UserName
                  name={user.name}
                  pubkey={publicKey}
                  className="start"
                  verified
                />
              )}
              <UserNpub pubkey={publicKey} disableLink />
            </div>
          </div>
          <CustomIcon
            className="hidden h-6 w-6 xl:block"
            iconName="EllipsisHorizontalIcon"
          />
        </Menu.Button>
        <AnimatePresence>
          <Menu.Items
            className="rounded-md bg-white outline-none absolute left-0 right-0 -top-16 w-60 xl:w-full py-2
               shadow-[0px_0px_15px_rgba(101,119,134,0.2)]"
            as={motion.div}
            {...variants}
          >
            <Menu.Item>
              {({ active }): JSX.Element => (
                <button
                  className={cn(
                    "flex w-full gap-3 p-3 font-bold",
                    active && "bg-gray-100"
                  )}
                  onClick={logout}
                >
                  Log out
                </button>
              )}
            </Menu.Item>
            <i
              className="absolute -bottom-[10px] left-2 translate-x-1/2 rotate-180
                           xl:left-1/2 xl:-translate-x-1/2"
            >
              <CustomIcon
                className="h-4 w-6 fill-white"
                iconName="TriangleIcon"
              />
            </i>
          </Menu.Items>
        </AnimatePresence>
      </Menu>
    </>
  );
}

export default SidebarProfile;
