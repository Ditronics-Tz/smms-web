import React, { useEffect, useState } from "react";
import {
    Box, Typography, Button, Sheet, Select, Option, Input, Stepper, Step,
    StepIndicator, Chip, Table, Stack, List, ListItem, ListItemContent
} from "@mui/joy";
import {
    CloudUploadOutlined, FileDownloadOutlined, CheckCircleOutlineRounded, ErrorOutlineRounded,
    ReplayOutlined, SendOutlined, KeyboardArrowLeftOutlined, TaskAltRounded, InfoOutlined
} from "@mui/icons-material";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { STATUS } from "../../../constant";
import {
    importPreviewRequest, importPreviewReset, importCommitRequest, importCommitReset, schoolListRequest
} from "../../../store/actions";
import { NAVIGATE_TO_STUDENTPAGE } from "../../../route/types";
import { LoadingView } from "../../../components";

// Columns of the import template (aligned with the backend import columns).
const IMPORT_TEMPLATE_COLUMNS = ["first_name", "middle_name", "last_name", "gender", "date_of_birth", "class_room", "admission_no"];

const WizardStep = ({ activeStep, onChange }) => {
    const { t } = useTranslation();
    const steps = [
        { label: t("studentsImport.upload") },
        { label: t("studentsImport.preview") },
        { label: t("studentsImport.confirmStep") },
    ];
    return (
        <Stepper size="sm" sx={{ my: 2, flexWrap: 'wrap' }}>
            {steps.map((s, index) => (
                <Step
                    key={index}
                    indicator={
                        <StepIndicator
                            variant={index === activeStep ? 'solid' : 'soft'}
                            color={index < activeStep ? 'success' : 'primary'}
                        >
                            {index < activeStep ? <CheckCircleOutlineRounded /> : index + 1}
                        </StepIndicator>
                    }
                    orientation="vertical"
                    onClick={() => index < activeStep && onChange(index)}
                    sx={{ cursor: index < activeStep ? 'pointer' : 'default', minWidth: '120px', '--Step-connectorInset': '10px' }}
                >
                    {s.label}
                </Step>
            ))}
        </Stepper>
    );
};

const UploadStep = ({ t, schoolStatus, schoolList, selectedSchool, setSelectedSchool, file, fileName, setFile, setFileName, previewing, handlePreview }) => {
    return (
        <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'lg', maxWidth: 560, mx: 'auto' }}>
            <Stack spacing={2}>
                <Box>
                    <Typography level="title-lg">{t("studentsImport.title")}</Typography>
                    <Typography level="body-sm" sx={{ mt: 0.5 }}>
                        {t("studentsImport.instructions")}
                    </Typography>
                </Box>

                {/* school selection */}
                <Box>
                    <Typography level="body-sm" sx={{ mb: 0.5 }}>{t("studentsImport.selectSchool")}</Typography>
                    <Select
                        size="sm"
                        value={selectedSchool}
                        placeholder={t("init.select") + t("studentsImport.selectSchool")}
                        disabled={schoolStatus !== STATUS.SUCCESS}
                        onChange={(e, value) => setSelectedSchool(value)}>
                        {schoolStatus === STATUS.SUCCESS ? schoolList.results.map((item) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        )) : <Option value={null}>{t("school.NoList")}</Option>}
                    </Select>
                </Box>

                {/* actions for step1 */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
                    <Button
                        size="sm"
                        variant="soft"
                        startDecorator={<FileDownloadOutlined />}
                        onClick={() => downloadTemplate(t)}>
                        {t("studentsImport.downloadTemplate")}
                    </Button>

                    <Button
                        size="sm"
                        variant="outlined"
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startDecorator={<CloudUploadOutlined />}
                        disabled={!selectedSchool}>
                        {t("studentsImport.chooseFile")}
                        <input
                            type="file"
                            hidden
                            accept=".csv,.xls,.xlsx"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                setFileName(f?.name || "");
                                if (f) setFile(f);
                            }}
                        />
                    </Button>
                </Stack>

                {fileName && (
                    <Chip size="sm" variant="soft" color="neutral" startDecorator={<InfoOutlined />}>
                        {fileName}
                    </Chip>
                )}

                <Button
                    size="sm"
                    color="primary"
                    startDecorator={<TaskAltRounded />}
                    disabled={!file || !selectedSchool || previewing}
                    onClick={handlePreview}>
                    {previewing ? t("init.loading") : t("studentsImport.preview")}
                </Button>
            </Stack>
        </Sheet>
    )
}

export const StudentsImportPage = ({ accessToken, schoolStatus, schoolList, importPreviewStatus, importPreviewResult, importPreviewErrorMessage, importCommitStatus, importCommitResult, importCommitErrorMessage }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    // normalized preview report
    const [rows, setRows] = useState([]);
    const [revalidating, setRevalidating] = useState(false);

    const validRows = rows.filter((r) => r.status === 'valid');
    const invalidRows = rows.filter((r) => r.status === 'invalid');

    useEffect(() => {
        dispatch(schoolListRequest(accessToken, {}, 1));
        /* eslint-disable-next-line */
    }, [])

    /* normalize the server response into a flat row list */
    const normalizeRows = (res) => {
        const out = [];
        const push = (arr, status) => (arr || []).forEach((r) => {
            out.push({
                row_number: r.row_number ?? r.row ?? 0,
                data: r.data ?? r.row_data ?? {},
                status: r.valid === true ? 'valid' : status,
                reasons: r.reasons ?? r.errors ?? []
            })
        });
        if (Array.isArray(res?.rows)) {
            res.rows.forEach((r) => push([r], r.valid ? 'valid' : 'invalid'));
        } else {
            push(res?.valid_rows, 'valid');
            push(res?.invalid_rows, 'invalid');
        }
        return out.sort((a, b) => a.row_number - b.row_number);
    }

    /* merge an incoming report into the existing rows by row_number (keeps inline edits) */
    const mergeRows = (incoming) => {
        setRows((prev) => {
            const map = {};
            incoming.forEach((r) => { map[r.row_number] = r; });
            const merged = prev.map((r) => (
                map[r.row_number] ? { ...r, status: map[r.row_number].status, reasons: map[r.row_number].reasons } : r
            ));
            const added = incoming.filter((r) => !prev.some((p) => p.row_number === r.row_number));
            return [...merged, ...added].sort((a, b) => a.row_number - b.row_number);
        });
    }

    // preview success/error
    useEffect(() => {
        if (importPreviewStatus === STATUS.SUCCESS) {
            const incoming = normalizeRows(importPreviewResult);
            if (revalidating) {
                mergeRows(incoming);
                setRevalidating(false);
            } else {
                setRows(incoming);
                setStep(1);
            }
            dispatch(importPreviewReset());
        } else if (importPreviewStatus === STATUS.ERROR) {
            toast.error(importPreviewErrorMessage);
            setRevalidating(false);
            dispatch(importPreviewReset());
        }
    }, [importPreviewStatus])
    /* eslint-disable-next-line */

    // commit success/error
    useEffect(() => {
        if (importCommitStatus === STATUS.SUCCESS) {
            setStep(2);
            dispatch(importCommitReset());
        } else if (importCommitStatus === STATUS.ERROR) {
            toast.error(importCommitErrorMessage);
            dispatch(importCommitReset());
        }
    }, [importCommitStatus])
    /* eslint-disable-next-line */

    const handlePreview = () => {
        const formData = new FormData();
        formData.append('school_id', selectedSchool);
        formData.append('file', file);
        dispatch(importPreviewRequest(accessToken, formData));
    }

    const handleRevalidate = () => {
        const payload = invalidRows.map((r) => ({ row_number: r.row_number, data: r.data }));
        const formData = new FormData();
        formData.append('school_id', selectedSchool);
        formData.append('rows', JSON.stringify(payload));
        setRevalidating(true);
        dispatch(importPreviewRequest(accessToken, formData));
    }

    const handleCommit = () => {
        const payload = validRows.map((r) => ({ row_number: r.row_number, data: r.data }));
        dispatch(importCommitRequest(accessToken, { school_id: selectedSchool, rows: payload }));
    }

    const resetImport = () => {
        setStep(0);
        setRows([]);
        setFile(null);
        setFileName("");
        setSelectedSchool(null);
    }

    const handleUpdateCell = (rowNumber, column, value) => {
        setRows((prev) => prev.map((r) => (
            r.row_number === rowNumber ? { ...r, data: { ...r.data, [column]: value } } : r
        )));
    }

    const loading = importPreviewStatus === STATUS.LOADING || importCommitStatus === STATUS.LOADING || (step === 0 && schoolStatus === STATUS.LOADING);

    if (step === 2) {
        const summary = importCommitResult ?? {};
        const failures = summary.failed_samples ?? [];
        return (
            <Box>
                <WizardStep activeStep={2} onChange={setStep} />
                <LoadingView loading={importCommitStatus === STATUS.LOADING} />
                <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'lg', maxWidth: 560, mx: 'auto' }}>
                    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
                        <TaskAltRounded sx={{ fontSize: 48, color: 'success.main' }} />
                        <Typography level="title-lg">{t("studentsImport.successTitle")}</Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Chip color="success" variant="soft">{t("studentsImport.created")}: {summary.created ?? validRows.length}</Chip>
                            <Chip color="neutral" variant="soft">{t("studentsImport.skipped")}: {summary.skipped_duplicates ?? summary.skipped ?? 0}</Chip>
                            <Chip color="danger" variant="soft">{t("studentsImport.failures")}: {failures.length || 0}</Chip>
                        </Stack>
                        {failures.length > 0 && (
                            <List size="sm" variant="outlined" sx={{ borderRadius: 'md', width: '100%', textAlign: 'left' }}>
                                {failures.map((f, i) => (
                                    <ListItem key={i}>
                                        <ListItemContent>
                                            <Typography level="body-xs" color="danger">
                                                {t("studentsImport.rowLabel")} {f.row_number}: {typeof f.reason === 'string' ? f.reason : (f.reasons ?? []).join(', ')}
                                            </Typography>
                                        </ListItemContent>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        <Button
                            size="sm"
                            color="success"
                            startDecorator={<CheckCircleOutlineRounded />}
                            onClick={() => navigate(NAVIGATE_TO_STUDENTPAGE)}>
                            {t("studentsImport.done")}
                        </Button>
                    </Stack>
                </Sheet>
            </Box>
        )
    }

    return (
        <Box>
            <WizardStep activeStep={step} onChange={setStep} />
            <LoadingView loading={loading} />

            {step === 0 && (
                <UploadStep
                    t={t}
                    schoolStatus={schoolStatus}
                    schoolList={schoolList}
                    selectedSchool={selectedSchool}
                    setSelectedSchool={setSelectedSchool}
                    file={file}
                    fileName={fileName}
                    setFile={setFile}
                    setFileName={setFileName}
                    previewing={importPreviewStatus === STATUS.LOADING}
                    handlePreview={handlePreview}
                />
            )}

            {step === 1 && (
                <Box>
                    {/* summary */}
                    <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md', mb: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
                            <Chip color="neutral" variant="solid" size="sm">{t("studentsImport.total")}: {rows.length}</Chip>
                            <Chip color="success" variant="soft" size="sm" startDecorator={<CheckCircleOutlineRounded />}>{t("studentsImport.valid")}: {validRows.length}</Chip>
                            <Chip color="danger" variant="soft" size="sm" startDecorator={<ErrorOutlineRounded />}>{t("studentsImport.invalid")}: {invalidRows.length}</Chip>
                            <Box sx={{ flex: 1 }} />
                            <Button size="sm" variant="plain" color="neutral" startDecorator={<KeyboardArrowLeftOutlined />} onClick={resetImport}>
                                {t("studentsImport.back")}
                            </Button>
                            <Button
                                size="sm"
                                variant="soft"
                                color="warning"
                                startDecorator={<ReplayOutlined />}
                                onClick={handleRevalidate}
                                disabled={invalidRows.length === 0 || importPreviewStatus === STATUS.LOADING}>
                                {t("studentsImport.revalidate")}
                            </Button>
                            <Button
                                size="sm"
                                color="success"
                                startDecorator={<SendOutlined />}
                                onClick={handleCommit}
                                disabled={validRows.length === 0 || importCommitStatus === STATUS.LOADING}>
                                {t("studentsImport.continue")} ({validRows.length} {t("studentsImport.valid")})
                            </Button>
                        </Stack>
                    </Sheet>

                    {invalidRows.length > 0 && (
                        <Typography level="body-sm" color="danger" sx={{ mb: 1 }}>
                            {t("studentsImport.editHint")}
                        </Typography>
                    )}

                    <Sheet variant="outlined" sx={{ borderRadius: 'md', overflowX: 'auto' }}>
                        <Table size="sm" stickyHeader sx={{ minWidth: 720 }}>
                            <thead>
                                <tr>
                                    <th style={{ width: 70 }}>#</th>
                                    {IMPORT_TEMPLATE_COLUMNS.map((col) => (
                                        <th key={col}>{t(`studentsImport.columns.${col}`, col.replace(/_/g, " "))}</th>
                                    ))}
                                    <th style={{ width: 120 }}>{t("studentsImport.statusLabel")}</th>
                                    <th >{t("studentsImport.reasons")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.row_number}>
                                        <td>{row.row_number}</td>
                                        {IMPORT_TEMPLATE_COLUMNS.map((col) => (
                                            <td key={col}>
                                                {row.status === 'valid'
                                                    ? <Typography level="body-sm">{row.data[col] ?? "—"}</Typography>
                                                    : <Input
                                                        size="sm"
                                                        value={row.data[col] ?? ""}
                                                        onChange={(e) => handleUpdateCell(row.row_number, col, e.target.value)}
                                                    />}
                                            </td>
                                        ))}
                                        <td>
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={row.status === 'valid' ? 'success' : 'danger'}>
                                                {row.status === 'valid' ? t("studentsImport.valid") : t("studentsImport.invalid")}
                                            </Chip>
                                        </td>
                                        <td>
                                            {row.reasons.length > 0 && (
                                                <List size="sm">
                                                    {row.reasons.map((r, i) => (
                                                        <ListItem key={i}>
                                                            <Typography level="body-xs" color="danger">- {r}</Typography>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </Box>
            )}
        </Box>
    )
}

/* download a csv template built from the template columns */
const downloadTemplate = (t) => {
    const header = IMPORT_TEMPLATE_COLUMNS.join(',');
    const sample = IMPORT_TEMPLATE_COLUMNS.map((col) => {
        const map = {
            first_name: 'John', middle_name: 'M.', last_name: 'Doe', gender: 'M',
            date_of_birth: '2012-01-15', class_room: 'Form One', admission_no: 'ADM-001'
        };
        return map[col] ?? '';
    }).join(',');
    const blob = new Blob([header + "\n" + sample + "\n"], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'students-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

const mapStateToProps = ({ auth, resources }) => {
    const { accessToken,
        importPreviewStatus, importPreviewResult, importPreviewErrorMessage,
        importCommitStatus, importCommitResult, importCommitErrorMessage,
    } = auth
    const {
        schoolListResult: schoolList,
        schoolListStatus: schoolStatus,
    } = resources
    return {
        accessToken,
        importPreviewStatus, importPreviewResult, importPreviewErrorMessage,
        importCommitStatus, importCommitResult, importCommitErrorMessage,
        schoolList, schoolStatus
    }
}

export default connect(mapStateToProps, {})(StudentsImportPage)