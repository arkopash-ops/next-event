"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { type EventCategory } from "@/types/eventCategories";
import { useEffect, useMemo, useState } from "react";
import CategoryFilter from "./components/CategoryFilter";
import EventDetails from "./components/EventDetails";
import EventList from "./components/EventList";
import UserDashboardHeader from "./components/UserDashboardHeader";
import { useBookingFlow } from "./hooks/useBookingFlow";
import { usePublicEvents } from "./hooks/usePublicEvents";
import { useUserProfile } from "./hooks/useUserProfile";

export default function UserDashboardPage() {
  const { name } = useUserProfile();
  const { events } = usePublicEvents();
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "ALL"
  >("ALL");
  const {
    selectedEvent,
    selectedShow,
    loadingShow,
    quantity,
    setQuantity,
    bookingLoading,
    bookingMessage,
    bookingId,
    paymentLoading,
    tickets,
    selectEvent,
    selectShow,
    createBooking,
    payForBooking,
    loadTickets,
    clearSelection,
  } = useBookingFlow();

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "ALL") return events;

    return events.filter((event) => event.category === selectedCategory);
  }, [events, selectedCategory]);

  useEffect(() => {
    if (!selectedEvent) return;

    const isSelectedEventVisible = filteredEvents.some(
      (event) => event.id === selectedEvent.id,
    );

    if (!isSelectedEventVisible) {
      clearSelection();
    }
  }, [clearSelection, filteredEvents, selectedEvent]);

  return (
    <ProtectedRoute allowedRoles={["USER"]}>
      <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <UserDashboardHeader name={name} />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EventList events={filteredEvents} onSelectEvent={selectEvent} />

            <EventDetails
              selectedEvent={selectedEvent}
              selectedShow={selectedShow}
              loadingShow={loadingShow}
              quantity={quantity}
              setQuantity={setQuantity}
              bookingLoading={bookingLoading}
              paymentLoading={paymentLoading}
              bookingId={bookingId}
              bookingMessage={bookingMessage}
              tickets={tickets}
              onSelectShow={selectShow}
              onBook={createBooking}
              onPay={payForBooking}
              onGetTickets={loadTickets}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
