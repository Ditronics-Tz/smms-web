import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    FormControl,
    FormLabel,
    Input,
    Option,
    Select,
    Sheet,
    Typography,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffRounded from "@mui/icons-material/FilterAltOffRounded";
import { useTranslation } from "react-i18next";

// The statuses the API already reports on transactions; kept as the single
// source of truth for both the filter chips and the row badges.
export const TRANSACTION_STATUSES = ["successful", "failed", "penalt", "pending", "reversed"] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

// The API reports the "successful" state under that name, but the locale files
// call it `status.success`. This map is the single place that knows the
// difference, so the filter chips and the row badges cannot drift apart.
export const TRANSACTION_STATUS_LABEL_KEYS: Record<TransactionStatus, string> = {
    successful: "success",
    failed: "failed",
    penalt: "penalt",
    pending: "pending",
    reversed: "reversed",
};

export const transactionStatusLabel = (
    t: (key: string) => string,
    status: string | null | undefined
): string => {
    if (!status) return "";
    const alias = TRANSACTION_STATUS_LABEL_KEYS[status as TransactionStatus];
    return t(`status.${alias ?? status}`);
};

// Chip colours, shared by the filter bar and both table layouts.
export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
    successful: "success",
    failed: "danger",
    penalt: "warning",
    pending: "neutral",
    reversed: "neutral",
};

export interface TransactionFiltersValue {
    search: string;
    start_date: string;
    end_date: string;
    status: TransactionStatus[];
}

const EMPTY_FILTERS: TransactionFiltersValue = {
    search: "",
    start_date: "",
    end_date: "",
    status: [],
};

const isDirty = (f: TransactionFiltersValue) =>
    f.search !== "" || f.start_date !== "" || f.end_date !== "" || f.status.length > 0;

const countActive = (f: TransactionFiltersValue) =>
    (f.search !== "" ? 1 : 0) +
    (f.start_date !== "" || f.end_date !== "" ? 1 : 0) +
    (f.status.length > 0 ? 1 : 0);

/**
 * Filter bar for the transaction lists: free-text search, a date range and a
 * multi-select status filter.
 *
 * `onChange` is debounced for the free-text field only, so typing does not fire
 * a request per keystroke, while the dropdowns and date pickers apply at once.
 */
const TransactionFilterBar = ({
    value,
    onChange,
    loading = false,
}: {
    value: TransactionFiltersValue;
    onChange: (next: TransactionFiltersValue) => void;
    loading?: boolean;
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState(value.search);
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const activeCount = countActive(value);

    // Keep local text in step when the parent resets or restores the filters.
    useEffect(() => {
        setSearch(value.search);
    }, [value.search]);

    useEffect(() => {
        if (search === value.search) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onChange({ ...value, search });
        }, 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const statusOptions = useMemo(
        () =>
            TRANSACTION_STATUSES.map((s) => ({
                value: s,
                label: transactionStatusLabel(t, s),
            })),
        [t]
    );

    const handleClear = () => {
        setSearch("");
        onChange(EMPTY_FILTERS);
    };

    // A range that ends before it starts can never match, so swap instead of
    // silently returning nothing.
    const handleStartDate = (next: string) => {
        const patch: TransactionFiltersValue = { ...value, start_date: next };
        if (patch.end_date && next && patch.end_date < next) {
            patch.end_date = next;
        }
        onChange(patch);
    };

    const handleEndDate = (next: string) => {
        const patch: TransactionFiltersValue = { ...value, end_date: next };
        if (patch.start_date && next && next < patch.start_date) {
            patch.start_date = next;
        }
        onChange(patch);
    };

    return (
        <Box>
            <Sheet
                variant="outlined"
                sx={{
                    p: { xs: 1, sm: 1.5 },
                    my: 1,
                    borderRadius: "sm",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                    gap: 1.5,
                }}
            >
            {/* Free text */}
            <FormControl sx={{ flex: "1 1 200px", minWidth: 0 }}>
                <FormLabel>{t("transaction.filters.search")}</FormLabel>
                <Input
                    size="sm"
                    placeholder={t("transaction.filters.searchPlaceholder")}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    startDecorator={<SearchIcon />}
                />
            </FormControl>

            {/* Date range */}
            <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                <FormLabel>{t("transaction.filters.from")}</FormLabel>
                <Input
                    size="sm"
                    type="date"
                    value={value.start_date}
                    onChange={(e) => handleStartDate(e.target.value)}
                    slotProps={{ input: { max: value.end_date || undefined } }}
                />
            </FormControl>

            <FormControl sx={{ flex: "0 1 160px", minWidth: 0 }}>
                <FormLabel>{t("transaction.filters.to")}</FormLabel>
                <Input
                    size="sm"
                    type="date"
                    value={value.end_date}
                    onChange={(e) => handleEndDate(e.target.value)}
                    slotProps={{ input: { min: value.start_date || undefined } }}
                />
            </FormControl>

            {/* Status multi-select */}
            <FormControl sx={{ flex: "1 1 190px", minWidth: 0 }}>
                <FormLabel>{t("transaction.filters.status")}</FormLabel>
                <Select
                    size="sm"
                    multiple
                    value={value.status}
                    onChange={(e, newValue) =>
                        onChange({ ...value, status: newValue as TransactionStatus[] })
                    }
                    renderValue={(selected) =>
                        selected.length === 0 ? (
                            t("transaction.filters.allStatuses")
                        ) : (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((opt) => (
                                    <Chip key={String(opt.value)} size="sm" variant="soft" color="primary">
                                        {opt.label}
                                    </Chip>
                                ))}
                            </Box>
                        )
                    }
                    sx={{ minHeight: "36px" }}
                >
                    {statusOptions.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                            {opt.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <Button
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={handleClear}
                disabled={!isDirty(value) || loading}
                startDecorator={<FilterAltOffRounded />}
                sx={{ flex: "0 0 auto" }}
            >
                    {t("transaction.filters.clear")}
                </Button>
            </Sheet>

            {/* A short table is often just a narrow filter, so say so explicitly. */}
            {activeCount > 0 && (
                <Typography level="body-xs" sx={{ color: "text.tertiary", mb: 0.5 }}>
                    {activeCount === 1
                        ? t("transaction.filters.activeOne")
                        : t("transaction.filters.active", { count: activeCount })}
                </Typography>
            )}
        </Box>
    );
};

export default TransactionFilterBar;
