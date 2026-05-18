import { getUpcomingSchedules } from "@/infrastructure/storage/supabase-queries"
import ScheduleClient from "./schedule-client"

export default async function SchedulePage() {
  const { data: schedules, error } = await getUpcomingSchedules()
  return <ScheduleClient schedules={schedules ?? []} error={error?.message ?? null} />
}
