"use client";

import { useContext, useEffect, useState } from "react";
import { RelayContext } from "@/app/context/relay-provider";

function Explore() {
  const { subscribe, relayUrl, activeRelay } = useContext(RelayContext);
  const [events, setEvents] = useState<any[]>([]);

  const getEvents = () => {
    const filter = {
      kinds: [1],
      limit: 10,
    };

    let newEvents: any[] = [];

    const onEvent = (event: any) => {
      newEvents.push(event);
    };

    const onEOSE = () => {
      if (newEvents.length === 0) {
        setEvents([]);
        return;
      }
      console.log("newEvents", newEvents);
      setEvents(newEvents);
    };

    subscribe([relayUrl], filter, onEvent, onEOSE);
  };

  return (
    <main className="flex flex-col min-h-screen w-full max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl border-r">
      <div className="flex py-4 px-3 sticky top-0 z-50 border-b">
        <h2 className="text-lg sm:text-xl font-bold">Explore</h2>
      </div>
    </main>
  );
}

export default Explore;
