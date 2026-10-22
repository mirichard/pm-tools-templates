import { act, renderHook } from '@testing-library/react'
import { useSavedDashboardSettings } from '@/lib/use-saved-dashboard-settings'
import { useMediaQuery } from '@/components/design-system/responsive'

afterEach(() => { localStorage.clear(); jest.restoreAllMocks() })

test('reads saved settings and responds to storage changes and removal', () => {
  localStorage.setItem('dashboardSettings', JSON.stringify({ theme: 'dark' }))
  const { result } = renderHook(() => useSavedDashboardSettings())
  expect(result.current?.theme).toBe('dark')
  act(() => {
    localStorage.setItem('dashboardSettings', JSON.stringify({ theme: 'light' }))
    window.dispatchEvent(new StorageEvent('storage', { key: 'dashboardSettings' }))
  })
  expect(result.current?.theme).toBe('light')
  act(() => {
    localStorage.removeItem('dashboardSettings')
    window.dispatchEvent(new StorageEvent('storage', { key: 'dashboardSettings' }))
  })
  expect(result.current).toBeNull()
})

test('invalid or inaccessible saved settings fall back safely', () => {
  localStorage.setItem('dashboardSettings', '{invalid')
  const { result, unmount } = renderHook(() => useSavedDashboardSettings())
  expect(result.current).toBeNull()
  unmount()
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  expect(renderHook(() => useSavedDashboardSettings()).result.current).toBeNull()
})

test('media queries read initial state, react to changes, and unsubscribe', () => {
  let matches = true
  let notify = () => {}
  const removeEventListener = jest.fn()
  const query = {
    get matches() { return matches },
    addEventListener: jest.fn((_event: string, listener: () => void) => { notify = listener }),
    removeEventListener,
  } as unknown as MediaQueryList
  jest.spyOn(window, 'matchMedia').mockReturnValue(query)
  const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 800px)'))
  expect(result.current).toBe(true)
  act(() => { matches = false; notify() })
  expect(result.current).toBe(false)
  unmount()
  expect(removeEventListener).toHaveBeenCalledWith('change', notify)
})
