"use client";

import SimpleTooltip from "@/components/simple-tooltip";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { ReactElement } from "react";
import CountUp from "react-countup";

type StatisticProps = {
	name: string;
	value: number;
	format: "number" | "bytes";
	icon: ReactElement;
	tooltip?: string | ReactElement;
};

export default function UserStatistic({
	name,
	value,
	format,
	icon,
	tooltip,
}: StatisticProps) {
	const base = (
		<div className="p-2 bg-background/70 flex justify-between rounded-md border border-muted">
			<div className="flex flex-col">
				<span className="font-semibold">{name}</span>
				<span className="text-muted-foreground">
					<CountUp
						end={value}
						duration={1.5}
						formattingFn={
							format == "bytes" ? formatBytes : formatNumberWithCommas
						}
					/>
				</span>
			</div>
			{icon}
		</div>
	);

	if (tooltip) {
		return <SimpleTooltip content={tooltip}>{base}</SimpleTooltip>;
	}

	return base;
}
