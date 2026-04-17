"use client";

import { useEffect, useState, useCallback } from "react";
import LeadDetailModal from "@/components/dashboard/LeadDetailModal";

interface Lead {
  id: string;
  기업명: string;
  사업자번호: string;
  대표자명: string;
  연락처: string;
  이메일: string;
  업종: string;
  설립연도: string;
  통화가능시간: string;
  자금규모: string;
  자금종류: string;
  문의사항: string;
  접수일시: string;
  상태: string;
  메모: string;
  유입경로?: string;
  _table?: string;
}

interface Stats {
  total: number;
  신규: number;
  대기: number;
  상담중: number;
  진행중: number;
  완료: number;
}

const STATUS_TABS = [
  "전체",
  "신규",
  "대기",
  "상담중",
  "진행중",
  "완료",
] as const;

const STATUS_COLORS: Record<string, string> = {
  신규: "bg-blue-500/20 text-blue-400",
  대기: "bg-yellow-500/20 text-yellow-400",
  상담중: "bg-purple-500/20 text-purple-400",
  진행중: "bg-orange-500/20 text-orange-400",
  완료: "bg-green-500/20 text-green-400",
};

const STATUS_COUNTER_STYLES: Record<
  string,
  { bg: string; active: string; icon: string }
> = {
  전체: {
    bg: "bg-white/[0.04] border-white/[0.08]",
    active: "bg-navy text-white border-navy",
    icon: "text-gray-500",
  },
  신규: {
    bg: "bg-blue-500/10 border-blue-500/20",
    active: "bg-blue-500 text-white border-blue-500",
    icon: "text-blue-400",
  },
  대기: {
    bg: "bg-amber-500/10 border-amber-500/20",
    active: "bg-amber-500 text-white border-amber-500",
    icon: "text-amber-400",
  },
  상담중: {
    bg: "bg-purple-500/10 border-purple-500/20",
    active: "bg-purple-500 text-white border-purple-500",
    icon: "text-purple-400",
  },
  진행중: {
    bg: "bg-orange-500/10 border-orange-500/20",
    active: "bg-orange-500 text-white border-orange-500",
    icon: "text-orange-400",
  },
  완료: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    active: "bg-emerald-500 text-white border-emerald-500",
    icon: "text-emerald-400",
  },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("전체");
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    신규: 0,
    대기: 0,
    상담중: 0,
    진행중: 0,
    완료: 0,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingMemo, setEditingMemo] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [savingMemo, setSavingMemo] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error("Leads fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleQuickStatus = async (
    e: React.MouseEvent,
    lead: Lead,
    newStatus: string,
  ) => {
    e.stopPropagation();
    if (updatingId) return;
    setUpdatingId(lead.id);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          status: newStatus,
          _table: lead._table,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, 상태: newStatus } : l)),
        );
        setStats((prev) => {
          const updated = { ...prev };
          const oldStatus = lead.상태 as keyof Stats;
          const newStat = newStatus as keyof Stats;
          if (typeof updated[oldStatus] === "number")
            (updated[oldStatus] as number)--;
          if (typeof updated[newStat] === "number")
            (updated[newStat] as number)++;
          else (updated as Record<string, number>)[newStatus] = 1;
          return updated;
        });
        showToast("success", `${lead.기업명 || lead.대표자명} → ${newStatus}`);
      } else {
        showToast("error", "상태 변경 실패");
      }
    } catch (error) {
      console.error("Status update error:", error);
      showToast("error", "네트워크 오류");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveMemo = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!editingMemo || savingMemo) return;
    setSavingMemo(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMemo.id,
          memo: editingMemo.value,
          _table: leads.find((l) => l.id === editingMemo.id)?._table,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === editingMemo.id ? { ...l, 메모: editingMemo.value } : l,
          ),
        );
        setEditingMemo(null);
        showToast("success", "메모 저장됨");
      } else {
        showToast("error", "메모 저장 실패");
      }
    } catch (error) {
      console.error("Memo save error:", error);
      showToast("error", "네트워크 오류");
    } finally {
      setSavingMemo(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    if (
      !confirm(
        `"${lead.기업명 || lead.대표자명}" 접수를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    )
      return;
    setUpdatingId(lead.id);
    try {
      const res = await fetch(
        `/api/leads?id=${lead.id}&table=${lead._table || ""}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
        setStats((prev) => {
          const updated = { ...prev };
          updated.total--;
          const s = lead.상태 as keyof Stats;
          if (typeof updated[s] === "number") (updated[s] as number)--;
          return updated;
        });
        showToast("success", `${lead.기업명 || lead.대표자명} 삭제됨`);
      } else {
        showToast("error", "삭제 실패");
      }
    } catch {
      showToast("error", "네트워크 오류");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchFilter = filter === "전체" || lead.상태 === filter;
    if (!search) return matchFilter;
    const q = search.toLowerCase();
    return (
      matchFilter &&
      ((lead.기업명 || "").toLowerCase().includes(q) ||
        (lead.대표자명 || "").toLowerCase().includes(q) ||
        (lead.연락처 || "").includes(q))
    );
  });

  const getCountForTab = (tab: string): number => {
    if (tab === "전체") return stats.total || 0;
    return (stats as unknown as Record<string, number>)[tab] || 0;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-28 bg-white/[0.06] rounded-lg animate-pulse" />
          <div className="h-5 w-20 bg-white/[0.06] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[72px] rounded-xl bg-white/[0.04] animate-pulse"
            />
          ))}
        </div>
        <div className="h-11 rounded-xl bg-white/[0.04] animate-pulse" />
        <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="px-4 py-4 flex items-center justify-between border-b border-white/[0.04] last:border-b-0"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 w-36 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3 w-52 bg-white/[0.04] rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-white/[0.04] rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-up">
          <div
            className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">접수 관리</h1>
        <p className="text-sm text-gray-500">
          총{" "}
          <span className="font-semibold text-gray-200">
            {stats.total || leads.length}
          </span>
          건
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STATUS_TABS.map((tab) => {
          const count = getCountForTab(tab);
          const isActive = filter === tab;
          const style = STATUS_COUNTER_STYLES[tab];
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-3 rounded-xl text-center border transition-all duration-200 ${isActive ? style.active + " shadow-md scale-[1.02]" : style.bg + " hover:shadow-sm hover:scale-[1.01]"}`}
            >
              <p
                className={`text-xl font-bold leading-tight ${isActive ? "text-white" : "text-gray-200"}`}
              >
                {count}
              </p>
              <p
                className={`text-[11px] mt-0.5 font-medium ${isActive ? "text-white/80" : "text-gray-500"}`}
              >
                {tab}
              </p>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="기업명, 대표자명, 연락처 검색..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 bg-white/[0.04] transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/[0.06] transition-colors"
            aria-label="검색어 지우기"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              className="w-12 h-12 text-white/[0.1] mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">
              {search ? "검색 결과가 없습니다" : "접수 내역이 없습니다"}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-sm text-blue-400 hover:underline"
              >
                검색어 지우기
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      기업명 / 대표자
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      자금종류
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      접수일
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      상태
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      퀵액션
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      메모
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/[0.02] group transition-colors"
                    >
                      <td
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <p className="font-medium text-gray-200 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          {lead.기업명 || "-"}
                          {lead.유입경로 && lead.유입경로 !== "홈페이지" && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium">
                              META
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{lead.대표자명}</p>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${lead.연락처}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 hover:underline font-medium"
                        >
                          {lead.연락처}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {lead.자금종류 || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {lead.접수일시}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[lead.상태] || "bg-white/[0.06] text-gray-400"}`}
                        >
                          {lead.상태}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {updatingId === lead.id ? (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <svg
                                className="w-3.5 h-3.5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              변경중
                            </span>
                          ) : (
                            <>
                              {lead.상태 !== "상담중" &&
                                lead.상태 !== "진행중" &&
                                lead.상태 !== "완료" && (
                                  <button
                                    onClick={(e) =>
                                      handleQuickStatus(e, lead, "상담중")
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-colors"
                                    title="상담중으로 변경"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                      />
                                    </svg>
                                    통화
                                  </button>
                                )}
                              {lead.상태 !== "완료" && (
                                <button
                                  onClick={(e) =>
                                    handleQuickStatus(e, lead, "완료")
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors"
                                  title="완료로 변경"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  전환
                                </button>
                              )}
                              {(lead.상태 === "상담중" ||
                                lead.상태 === "진행중" ||
                                lead.상태 === "완료") && (
                                <button
                                  onClick={(e) =>
                                    handleQuickStatus(e, lead, "신규")
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-white/[0.06] transition-colors"
                                  title="신규로 되돌리기"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(e, lead)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/15 transition-colors"
                                title="삭제"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        {editingMemo?.id === lead.id ? (
                          <div
                            className="flex gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingMemo.value}
                              onChange={(e) =>
                                setEditingMemo({
                                  ...editingMemo,
                                  value: e.target.value,
                                })
                              }
                              className="flex-1 px-2.5 py-1.5 text-xs border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-blue-500/10 text-gray-200"
                              autoFocus
                              placeholder="메모 입력..."
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveMemo(e);
                                if (e.key === "Escape") setEditingMemo(null);
                              }}
                            />
                            <button
                              onClick={(e) => handleSaveMemo(e)}
                              disabled={savingMemo}
                              className="px-2.5 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
                            >
                              {savingMemo ? "..." : "저장"}
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMemo({
                                id: lead.id,
                                value: lead.메모 || "",
                              });
                            }}
                            className="cursor-text min-h-[28px] flex items-center"
                          >
                            {lead.메모 ? (
                              <p
                                className="text-xs text-gray-400 truncate"
                                title={lead.메모}
                              >
                                {lead.메모}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                + 메모 추가
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-white/[0.06]">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4">
                  <div
                    className="flex items-start justify-between mb-2 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-200 flex items-center gap-1.5">
                        {lead.기업명 || lead.대표자명}
                        {lead.유입경로 && lead.유입경로 !== "홈페이지" && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium">
                            META
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lead.대표자명} &middot;{" "}
                        <a
                          href={`tel:${lead.연락처}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-400 font-medium"
                        >
                          {lead.연락처}
                        </a>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lead.자금종류} &middot; {lead.접수일시}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${STATUS_COLORS[lead.상태] || "bg-white/[0.06] text-gray-400"}`}
                    >
                      {lead.상태}
                    </span>
                  </div>
                  {lead.메모 && editingMemo?.id !== lead.id && (
                    <div
                      className="mb-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMemo({ id: lead.id, value: lead.메모 });
                      }}
                    >
                      <p className="text-[11px] text-blue-400 font-medium mb-0.5">
                        메모
                      </p>
                      <p className="text-xs text-gray-300 whitespace-pre-wrap">
                        {lead.메모}
                      </p>
                    </div>
                  )}
                  {editingMemo?.id === lead.id && (
                    <div
                      className="mb-3 flex gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingMemo.value}
                        onChange={(e) =>
                          setEditingMemo({
                            ...editingMemo,
                            value: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 text-sm border border-blue-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-blue-500/10 text-gray-200"
                        placeholder="메모 입력..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveMemo(e);
                          if (e.key === "Escape") setEditingMemo(null);
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveMemo(e)}
                        disabled={savingMemo}
                        className="px-3.5 py-2 text-xs bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50"
                      >
                        {savingMemo ? "..." : "저장"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMemo(null);
                        }}
                        className="px-2.5 py-2 text-xs text-gray-500 rounded-xl hover:bg-white/[0.06]"
                      >
                        취소
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {updatingId === lead.id ? (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        변경중
                      </span>
                    ) : (
                      <>
                        {lead.상태 !== "상담중" &&
                          lead.상태 !== "진행중" &&
                          lead.상태 !== "완료" && (
                            <button
                              onClick={(e) =>
                                handleQuickStatus(e, lead, "상담중")
                              }
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-purple-500/15 text-purple-400 active:bg-purple-500/25 border border-purple-500/20"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              통화
                            </button>
                          )}
                        {lead.상태 !== "완료" && (
                          <button
                            onClick={(e) => handleQuickStatus(e, lead, "완료")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-green-500/15 text-green-400 active:bg-green-500/25 border border-green-500/20"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            전환
                          </button>
                        )}
                        {(lead.상태 === "상담중" ||
                          lead.상태 === "진행중" ||
                          lead.상태 === "완료") && (
                          <button
                            onClick={(e) => handleQuickStatus(e, lead, "신규")}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-gray-500 active:bg-white/[0.06] border border-white/[0.08]"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              />
                            </svg>
                            되돌리기
                          </button>
                        )}
                        {!lead.메모 && editingMemo?.id !== lead.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMemo({ id: lead.id, value: "" });
                            }}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-gray-500 active:bg-white/[0.06] border border-white/[0.08]"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            메모
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, lead)}
                          className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs text-red-400 active:bg-red-500/15 border border-red-500/20"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {(search || filter !== "전체") && filteredLeads.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {filter !== "전체" && `${filter} `}
          {search && `"${search}" `}검색 결과 {filteredLeads.length}건
        </p>
      )}

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={fetchLeads}
        />
      )}
    </div>
  );
}
