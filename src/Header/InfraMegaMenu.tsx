'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Search } from 'lucide-react'

import { ServiceIcon } from '@/components/site/icons'
import { getIconForServiceTitle } from '@/components/site/serviceIconMap'
import { getServiceLink, highlightMatch } from './headerMenuUtils'
import type { NavigationPageData } from './types'

export interface InfraMegaMenuProps {
  infraPages: NavigationPageData[]
  infraSubServices: NavigationPageData[]
  getSubServices: (parentId: string, subServices: NavigationPageData[]) => NavigationPageData[]
  setShowInfraMegaMenu: React.Dispatch<React.SetStateAction<boolean>>
  menuSearchQuery: string
  setMenuSearchQuery: React.Dispatch<React.SetStateAction<string>>
  activeInfraCategory: string | null
  setActiveInfraCategory: React.Dispatch<React.SetStateAction<string | null>>
}

export default function InfraMegaMenu({
  infraPages,
  infraSubServices,
  getSubServices,
  setShowInfraMegaMenu,
  menuSearchQuery,
  setMenuSearchQuery,
  activeInfraCategory,
  setActiveInfraCategory,
}: InfraMegaMenuProps) {
  return (
    <div
      onClick={() => setShowInfraMegaMenu(false)}
      className="fixed inset-0 top-[7.25rem] z-40 animate-in overflow-y-auto bg-black/40 fade-in p-4 backdrop-blur-sm duration-200 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex w-full max-w-5xl animate-in overflow-hidden rounded-2xl bg-white shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] slide-in-from-top-2 duration-300 md:max-h-[75vh]"
      >
        {(() => {
          const query = menuSearchQuery.trim().toLowerCase()
          const allEntries = infraPages
            .filter((page: NavigationPageData) => page && page.id && page.slug)
            .map((page: NavigationPageData) => ({
              page,
              subServices: getSubServices(page.id, infraSubServices).filter(
                (sub: NavigationPageData) => sub && sub.id && sub.slug,
              ),
            }))

          // Always filter to actual matches - a category name matching the
          // query shouldn't dump its whole unfiltered service list in too.
          const matched = query
            ? allEntries
                .map(({ page, subServices }) => {
                  const parentMatches = page.title.toLowerCase().includes(query)
                  const matchingSubs = subServices.filter((sub: NavigationPageData) =>
                    sub.title.toLowerCase().includes(query),
                  )
                  if (!parentMatches && matchingSubs.length === 0) return null
                  return { page, subServices: matchingSubs }
                })
                .filter((e): e is { page: NavigationPageData; subServices: NavigationPageData[] } => e !== null)
            : null

          // Browse mode: a category rail on the left, that category's full
          // service list on the right - one category in focus at a time.
          const active = allEntries.find((e) => e.page.id === activeInfraCategory) || allEntries[0]

          // The sidebar (and its search input) stays mounted in the same place
          // regardless of search state - swapping it out for a different layout
          // on the first keystroke was unmounting the input and killing focus,
          // so only the right-hand results pane changes based on the query.
          return (
            <>
              <div
                className="flex w-72 flex-none flex-col p-4 md:p-5"
                style={{ background: 'linear-gradient(160deg, #b3121f 0%, #d7213c 45%, #6e0d17 100%)' }}
              >
                <div className="mb-4 px-2">
                  <span className="mb-1.5 inline-block text-[11px] font-bold uppercase tracking-wider text-red-200">
                    IT Infra Services
                  </span>
                  <h2 className="text-base font-semibold leading-snug text-white">
                    Explore Our Infrastructure Services
                  </h2>
                </div>
                <div className="relative mb-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-white/60 focus:border-white/50 focus:bg-white/15"
                  />
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto">
                  {(matched || allEntries).map(({ page }) => {
                    const isActive = !matched && active?.page.id === page.id
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => setActiveInfraCategory(page.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive ? 'font-semibold text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <ServiceIcon
                          preset={getIconForServiceTitle(page.title)}
                          className={`h-4 w-4 flex-none ${isActive ? 'text-white' : 'text-white/60'}`}
                        />
                        <span
                          className={`flex-1 leading-snug ${isActive ? 'underline decoration-2 underline-offset-4' : ''}`}
                        >
                          {page.title}
                        </span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 flex-none text-white transition-opacity ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </button>
                    )
                  })}
                  {matched && matched.length === 0 && (
                    <p className="px-3 py-2 text-sm text-white/70">No matches.</p>
                  )}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-10">
                {matched ? (
                  matched.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No services found for &ldquo;{menuSearchQuery}&rdquo;. Try a different term.
                    </p>
                  ) : (
                    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                      {matched.map(({ page, subServices }) => (
                        <div key={page.id}>
                          <Link
                            href={getServiceLink(page)}
                            className="group mb-3 flex items-center gap-2.5"
                            onClick={() => setShowInfraMegaMenu(false)}
                          >
                            <ServiceIcon
                              preset={getIconForServiceTitle(page.title)}
                              className="h-4 w-4 flex-none text-primary_red"
                            />
                            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground transition-colors group-hover:text-primary_red">
                              {highlightMatch(page.title, menuSearchQuery, true)}
                            </h3>
                          </Link>
                          {subServices.length > 0 && (
                            <ul className="space-y-2">
                              {subServices.map((sub: NavigationPageData) => (
                                <li key={sub.id}>
                                  <Link
                                    href={getServiceLink(sub)}
                                    className="text-sm text-gray-600 transition-colors hover:text-primary_red"
                                    onClick={() => setShowInfraMegaMenu(false)}
                                  >
                                    {highlightMatch(sub.title, menuSearchQuery, true)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  active && (
                    <>
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground">{active.page.title}</h3>
                        <Link
                          href={getServiceLink(active.page)}
                          onClick={() => setShowInfraMegaMenu(false)}
                          className="group/overview inline-flex flex-none items-center gap-1 text-sm font-semibold text-primary_red"
                        >
                          Overview
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/overview:translate-x-0.5" />
                        </Link>
                      </div>

                      {active.subServices.length > 0 ? (
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {active.subServices.map((sub: NavigationPageData) => (
                            <li key={sub.id}>
                              <Link
                                href={getServiceLink(sub)}
                                onClick={() => setShowInfraMegaMenu(false)}
                                className="group flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary_red/30 hover:text-primary_red hover:shadow-md"
                              >
                                <ServiceIcon
                                  preset={getIconForServiceTitle(sub.title)}
                                  className="h-4 w-4 flex-none text-primary_red/70 transition-colors group-hover:text-primary_red"
                                />
                                <span className="flex-1 leading-snug">{sub.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">Explore this service in detail.</p>
                      )}
                    </>
                  )
                )}
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
