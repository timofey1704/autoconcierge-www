'use client'

import { useState, useEffect, useLayoutEffect } from 'react'

interface TabIndicatorStyle {
  left: number
  width: number
  opacity?: number
}

interface UseTabsOptions<T extends string> {
  defaultTab?: T | null
  allowDeselect?: boolean
  onTabChange?: (tab: T) => void
}

export function useTabs<T extends string>(tabs: T[], options: UseTabsOptions<T> = {}) {
  const { defaultTab = null, allowDeselect = false, onTabChange } = options

  const [selectedTab, setSelectedTab] = useState<T | null>(defaultTab)
  const [indicatorStyle, setIndicatorStyle] = useState<TabIndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  // создаем и инициализируем refs только при первом рендере
  // используем useState с ленивой инициализацией вместо useMemo
  const [refs] = useState(() => {
    const refsMap: { [key: string]: React.RefObject<HTMLButtonElement | null> } = {}
    tabs.forEach(tab => {
      refsMap[tab] = { current: null }
    })
    return refsMap as { [K in T]: React.RefObject<HTMLButtonElement | null> }
  })

  // используем useLayoutEffect для синхронного обновления индикатора после рендера
  useLayoutEffect(() => {
    if (!selectedTab) {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
      return
    }

    const activeRef = refs[selectedTab]

    if (activeRef?.current) {
      setIndicatorStyle({
        left: activeRef.current.offsetLeft,
        width: activeRef.current.offsetWidth,
        opacity: 1,
      })
    }
  }, [selectedTab, refs])

  // слушаем изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (!selectedTab) return

      const activeRef = refs[selectedTab]
      if (activeRef?.current) {
        setIndicatorStyle({
          left: activeRef.current.offsetLeft,
          width: activeRef.current.offsetWidth,
          opacity: 1,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedTab, refs])

  const handleTabChange = (tab: T) => {
    const newTab = allowDeselect && tab === selectedTab ? null : tab
    setSelectedTab(newTab)
    if (newTab !== null && onTabChange) {
      onTabChange(newTab)
    }
  }

  return {
    selectedTab,
    indicatorStyle,
    refs,
    handleTabChange,
  }
}
