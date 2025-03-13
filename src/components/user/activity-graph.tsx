"use client";

import { ActivityGraphResponse } from "@/app/api/user/[@me]/files/graph/route";
import SimpleTooltip from "@/components/simple-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import request from "@/lib/request";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { cn } from "@/lib/utils/utils";
import { useQuery } from "@tanstack/react-query";

const CELL_SIZE = 12; // Size of each cell in pixels
const CELL_GAP = 2; // Gap between cells in pixels
const CELL_TOTAL = CELL_SIZE + CELL_GAP; // Total space each cell takes

type ActivityGraphProps = {
  /**
   * The header of the graph.
   */
  header: string;

  /**
   * The description of the graph.
   */
  description: string;

  /**
   * The ID of the user to display data for.
   */
  userId: string;
};

export default function ActivityGraph({
  header,
  description,
  userId,
}: ActivityGraphProps) {
  const { isLoading, data: activityData } = useQuery({
    queryKey: ["activity-graph", userId],
    queryFn: () =>
      request.get<ActivityGraphResponse>("/api/user/@me/files/graph"),
    placeholderData: (data) => data,
  });
  const { weeks, monthPositions, dayLabels } = generateCalendarData(
    activityData?.graph
  );

  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
          {header}
        </h1>
        <p className="max-w-sm md:max-w-lg text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          {description}
        </p>
      </div>

      {/* Graph */}
      <div className="overflow-scroll">
        <div className="mx-auto w-fit flex flex-col gap-1.5">
          <div className="p-2 relative border border-muted rounded-lg">
            {/* Month labels row */}
            <div className="mb-1 ml-8 flex text-xs text-muted-foreground">
              {monthPositions.map((position, i) => (
                <div
                  key={`month-${i}`}
                  style={{
                    marginLeft:
                      i === 0
                        ? `${position.weekIndex * CELL_TOTAL}px`
                        : `${(position.weekIndex - monthPositions[i - 1].weekIndex - 1) * CELL_TOTAL}px`,
                  }}
                >
                  {position.month}
                </div>
              ))}
            </div>

            <div className="w-full flex">
              {/* Day of week labels */}
              <div className="mr-2 pt-1 text-xs text-muted-foreground">
                {dayLabels.map((day, i) => (
                  <div
                    key={`day-${i}`}
                    className="h-3 text-right leading-none"
                    style={{
                      height: `${CELL_TOTAL}px`,
                      lineHeight: `${CELL_TOTAL}px`,
                      paddingRight: "4px",
                    }}
                  >
                    {i % 2 === 0 ? day.substring(0, 3) : ""}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex">
                {weeks.map((week, weekIndex) => (
                  <div
                    key={`week-${weekIndex}`}
                    className="flex flex-col"
                    style={{ marginRight: `${CELL_GAP}px` }}
                  >
                    {week.map((day, dayIndex) => (
                      <div
                        className="mb-0"
                        key={`day-${weekIndex}-${dayIndex}`}
                        style={{
                          height: `${CELL_TOTAL}px`,
                        }}
                      >
                        {day ? (
                          <SimpleTooltip
                            content={`${day.count < 1 ? "No uploads" : `${day.count} upload${day.count > 1 ? "s" : ""}`} on ${day.date.toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}`}
                          >
                            <div>
                              <ActivityBox
                                loading={isLoading}
                                count={day.count}
                              />
                            </div>
                          </SimpleTooltip>
                        ) : (
                          <div className="size-3" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total & Legend */}
          <div className="place-self-end flex gap-1 items-center text-xs text-muted-foreground">
            {/* Total */}
            <div>
              {formatNumberWithCommas(activityData?.total ?? 0)} total uploads
              this year
            </div>

            <span>-</span>

            {/* Legend */}
            <div className="flex gap-2 items-center">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                <ActivityBox count={0} />
                <ActivityBox count={2} />
                <ActivityBox count={5} />
                <ActivityBox count={8} />
                <ActivityBox count={10} />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActivityBox = ({
  loading = false,
  count,
}: {
  loading?: boolean;
  count: number;
}) => {
  return loading ? (
    <Skeleton className="size-3 rounded-xs" />
  ) : (
    <div className={cn("size-3 rounded-xs", getColor(count))} />
  );
};

function generateCalendarData(
  activityData: Record<string, number> | undefined
) {
  const currentYear: number = new Date().getFullYear();
  const startDate: Date = new Date(currentYear, 0, 1);
  const endDate: Date = new Date(currentYear, 11, 31);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayLabels: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthPositions: { month: string; weekIndex: number }[] = [];

  // Create weeks array
  const weeks: (null | { date: Date; count: number; dateString: string })[][] =
    [];
  const currentDate: Date = new Date(startDate);
  let currentWeek: (null | {
    date: Date;
    count: number;
    dateString: string;
  })[] = [];

  // Fill in empty cells before the first day of the year
  const firstDayOfYear: number = startDate.getDay();
  for (let i = 0; i < firstDayOfYear; i++) {
    currentWeek.push(null);
  }

  // Track last seen month for detecting month changes
  let lastMonth: number = -1;

  // Loop through all days in the year
  while (currentDate <= endDate) {
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const dateString = `${currentYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Check for month change and record position
    if (month !== lastMonth) {
      monthPositions.push({
        month: monthNames[month],
        weekIndex: weeks.length,
      });
      lastMonth = month;
    }

    // Add day to current week
    currentWeek.push({
      date: new Date(currentDate),
      count: activityData?.[dateString] || 0,
      dateString,
    });

    // Check if week is complete
    if (currentDate.getDay() === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add any remaining days in the last week
  if (currentWeek.length > 0) {
    weeks.push([...currentWeek]);
  }

  return {
    weeks,
    monthPositions,
    dayLabels,
  };
}

function getColor(count: number) {
  if (count === 0) return "bg-zinc-200/10";
  if (count <= 2) return "bg-zinc-700";
  if (count <= 5) return "bg-zinc-500";
  if (count <= 8) return "bg-zinc-400";
  return "bg-zinc-300";
}
