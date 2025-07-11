import { act, render } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { type Options, useUrlState } from '..'

const setup = (initialEntries: MemoryRouterProps['initialEntries'], initialState: any = {}, options?: Options) => {
  const res = {} as {
    state: any
    setState: any
    location: ReturnType<typeof useLocation>
  }

  const Component = () => {
    const [state, setState] = useUrlState(initialState, options)
    const location = useLocation()
    Object.assign(res, { state, setState, location })

    return null
  }

  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Component />
    </MemoryRouter>,
  )

  return res
}

describe('React Router V6', () => {
  it('useUrlState should be work', () => {
    const res = setup(['/index'])
    act(() => {
      res.setState({ count: 1 })
    })

    expect(res.state).toMatchObject({ count: '1' })
  })
})

describe('useUrlState', () => {
  it('state should be url search params', () => {
    const res = setup([
      {
        pathname: '/index',
        search: '?count=1',
      },
    ])
    expect(res.state).toMatchObject({ count: '1' })
  })

  it('url shoule be changed when use setState', () => {
    const res = setup(['/index'])
    expect(res.state).toMatchObject({})
    act(() => {
      res.setState({ count: 1 })
    })
    expect(res.state).toMatchObject({ count: '1' })
  })

  it('multiple states should be work', () => {
    const res = setup(['/index'])
    act(() => {
      res.setState({ page: 1 })
    })
    act(() => {
      res.setState({ pageSize: 10 })
    })
    expect(res.state).toMatchObject({ page: '1', pageSize: '10' })
  })

  it('query-string options should work', async () => {
    const res = setup(
      [
        {
          pathname: '/index',
          search: '?foo=1,2,3',
        },
      ],
      {},
      {
        parseOptions: {
          arrayFormat: 'comma',
        },
        stringifyOptions: {
          arrayFormat: 'comma',
        },
      },
    )
    expect(res.state).toMatchObject({ foo: ['1', '2', '3'] })

    act(() => {
      res.setState({ foo: ['4', '5', '6'] })
    })
    expect(res.state).toMatchObject({ foo: ['4', '5', '6'] })
  })
})
