import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import usePageUrl from "@/hooks/use-page-url";
import { Page } from "@/lib/pagination";
import { FileKeys } from "@/type/file/file-keys";
import { SortDirection } from "@/type/sort-direction";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  FileText,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export type SortOption = {
  name: string;
  key: string;
};

type Sort = {
  key: string;
  direction: SortDirection;
};

interface FilterableContainerProps<T> {
  title: string;
  description: string;
  searchPlaceholder: string;
  noItemsTitle: string;
  noItemsDescription: string;
  sortOptions: SortOption[];
  data?: Page<T>;
  isLoading: boolean;
  isRefetching: boolean;
  initialSearch?: string;
  initialPage?: number;
  children: ReactNode;
  sortKey: string;
  onSortChange?: (sort: { key: string; direction: SortDirection }) => void;
  initialSort?: { key: string; direction: SortDirection };
  onPageChange?: (page: number) => void;
}

export default function FilterableContainer<T>({
  title,
  description,
  searchPlaceholder,
  noItemsTitle,
  noItemsDescription,
  sortOptions,
  data,
  isLoading,
  isRefetching,
  initialSearch,
  initialPage,
  children,
  sortKey,
  onSortChange,
  initialSort,
  onPageChange,
}: FilterableContainerProps<T>) {
  const pathname = usePathname();
  const initialRender = useIsFirstRender();
  const isMobile = useIsScreenSize(ScreenSize.Small);
  const { changePageUrl } = usePageUrl();

  const [page, setPage] = useState<number>(() => {
    const parsedInitialPage = Number(initialPage);
    return !isNaN(parsedInitialPage) && parsedInitialPage > 0
      ? parsedInitialPage
      : 1;
  });
  const [search, setSearch] = useState<string>(initialSearch ?? "");
  const [sort, setSort] = useState<Sort>(() => {
    if (initialSort) {
      return initialSort;
    }
    const savedSortKey = localStorage.getItem("sortKey");
    const savedSortDirection = localStorage.getItem(
      "sortDirection"
    ) as SortDirection;
    return {
      key: savedSortKey ?? "createdAt",
      direction: savedSortDirection ?? "desc",
    };
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (hasUserInteracted && onSortChange) {
      onSortChange(sort);
    }
  }, [sort, hasUserInteracted, onSortChange]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSortKey = localStorage.getItem(
        `${sortKey}-sortKey`
      ) as FileKeys;
      const savedSortDirection = localStorage.getItem(
        `${sortKey}-sortDirection`
      ) as SortDirection;

      if (savedSortKey || savedSortDirection) {
        setSort({
          key: savedSortKey ?? "createdAt",
          direction: savedSortDirection ?? "desc",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (hasUserInteracted) {
      setPage(1);
    }
  }, [debouncedSearch, sort, hasUserInteracted]);

  useEffect(() => {
    if (initialRender) {
      return;
    }

    if (!isNaN(page) && page > 0) {
      changePageUrl(pathname, {
        ...(page !== 1 && { page: String(page) }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
    }
  }, [debouncedSearch, page]);

  const handleSortChange = (value: string) => {
    setHasUserInteracted(true);
    setSort({
      ...sort,
      key: value as FileKeys,
    });
    localStorage.setItem(`${sortKey}-sortKey`, value);
  };

  const handleDirectionChange = () => {
    setHasUserInteracted(true);
    const direction = sort.direction === "asc" ? "desc" : "asc";
    setSort({
      ...sort,
      direction: direction,
    });
    localStorage.setItem(`${sortKey}-sortDirection`, direction);
  };

  const handleSearch = (value: string) => {
    setHasUserInteracted(true);
    setSearch(value);
  };

  const handleClearSearch = () => {
    setHasUserInteracted(true);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-6 w-full bg-gradient-to-r from-background/80 via-background/50 to-background/80 backdrop-blur-sm rounded-xl border border-muted/50 shadow-lg p-6">
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex gap-3 flex-col md:flex-row w-full md:w-auto">
          <div className="relative flex-1 min-w-0 md:min-w-[250px] max-w-full md:max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9 pr-8 w-full"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground text-muted-foreground transition-colors"
                onClick={handleClearSearch}
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:border-l md:border-muted/50 md:pl-3">
            <Select value={sort.key} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-[140px] bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4" /> Sort By
                  </SelectLabel>
                  {sortOptions.map((option, index) => (
                    <SelectItem key={index} value={option.key}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="bg-background/50 border-muted/50 shrink-0"
              onClick={handleDirectionChange}
            >
              {sort.direction === "asc" ? (
                <ArrowUpNarrowWide className="size-4" />
              ) : (
                <ArrowDownWideNarrow className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4">
          <Loader className="size-8" />
          <span className="text-muted-foreground animate-pulse">
            Loading...
          </span>
        </div>
      )}

      {data !== undefined && (
        <>
          {data.items.length > 0 ? (
            <>
              {children}

              <Pagination
                mobilePagination={isMobile}
                page={page}
                totalItems={data.metadata.totalItems}
                itemsPerPage={data.metadata.itemsPerPage}
                loadingPage={isLoading || isRefetching ? page : undefined}
                onPageChange={newPage => {
                  setPage(newPage);
                  onPageChange?.(newPage);
                }}
              />
            </>
          ) : (
            <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <FileText className="size-16 opacity-50" />
              <div className="text-center">
                <p className="text-lg font-medium">{noItemsTitle}</p>
                <p className="text-sm mt-1">{noItemsDescription}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
