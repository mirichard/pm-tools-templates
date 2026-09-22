import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ProgressChart } from '@/components/dashboard/progress-chart'

// Supply browser layout measurements; keep the actual Recharts components.
beforeEach(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const width = this.tagName === 'SPAN' ? 40 : 800
    const height = this.tagName === 'SPAN' ? 14 : 320
    return { width, height, top: 0, left: 0, right: width, bottom: height,
      x: 0, y: 0, toJSON: () => ({}) }
  })
})

afterEach(() => jest.restoreAllMocks())

test('renders all progress series and removes/restores the selected series', async () => {
  const { container } = render(<ProgressChart />)
  const curves = () => container.querySelectorAll('path.recharts-line-curve')
  await waitFor(() => expect(curves()).toHaveLength(3))
  for (const curve of curves()) {
    expect(curve.getAttribute('d')).toMatch(/^M/)
    expect(curve.getAttribute('d')).not.toMatch(/NaN|Infinity/)
  }
  expect(screen.getByText('Week 1')).toBeInTheDocument()
  expect(screen.getByText('Week 6')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Planned' }))
  await waitFor(() => expect(curves()).toHaveLength(2))
  expect(container.querySelector('path.recharts-line-curve[stroke="#3b82f6"]')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Planned' }))
  await waitFor(() => expect(curves()).toHaveLength(3))
  expect(container.querySelector('path.recharts-line-curve[stroke="#3b82f6"]')).not.toBeNull()
})

test('renders supplied data and handles an empty data set', async () => {
  const { container, rerender } = render(<ProgressChart data={[
    { week: 'Sprint A', planned: 30, actual: 25, issues: 2 },
    { week: 'Sprint B', planned: 60, actual: 55, issues: 1 },
  ]} />)
  await waitFor(() => expect(container.querySelectorAll('path.recharts-line-curve')).toHaveLength(3))
  expect(screen.getByText('Sprint A')).toBeInTheDocument()
  expect(screen.getByText('Sprint B')).toBeInTheDocument()
  rerender(<ProgressChart data={[]} />)
  await waitFor(() => expect(container.querySelectorAll('path.recharts-line-curve')).toHaveLength(0))
  expect(screen.getByText('Project Progress')).toBeInTheDocument()
})
