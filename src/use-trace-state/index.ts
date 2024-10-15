import { type DependencyList, type Dispatch, type SetStateAction, useState } from 'react'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { isFunction } from '../utils/is'

export const enum Trigger {
  trace = 'trace',
  set = 'set',
}

/**
 * 追踪依赖状态变化，当依赖变化后，重新获取状态
 * @param tracedState 被追踪的状态
 * @param options
 * deps: 依赖
 * onChangeBySet: 通过 setState 改变状态时的回调
 * onChangeByTrace: 通过追踪状态改变时的回调
 *
 * @returns [state, setState, trigger]
 */
export function useTraceState<S>(
  _traceState: S | (() => S),
  options?: {
    deps?: DependencyList
    defaultValue?: S | (() => S)
    onChangeBySet?: (state: S) => void
    onChangeByTrace?: (state: S) => void
  },
) {
  const { deps, defaultValue, onChangeBySet, onChangeByTrace } = options || {}

  const [traceState, setTraceState] = useState<{
    state: S
    trigger: 'trace' | 'set'
  }>(() => {
    const value = defaultValue || _traceState
    return {
      state: isFunction(value) ? value() : value,
      trigger: 'trace',
    }
  })

  const { state, trigger } = traceState

  useUpdateEffect(() => {
    setTraceState(
      isFunction(_traceState)
        ? () => ({
            state: _traceState(),
            trigger: Trigger.trace,
          })
        : {
            state: _traceState,
            trigger: Trigger.trace,
          },
    )
  }, [...(deps || []), ...(isFunction(_traceState) ? [] : [_traceState])])

  const setState: Dispatch<SetStateAction<S>> = useMemoizedFn((newState) => {
    if (isFunction(newState)) {
      setTraceState((t) => ({
        state: newState(t.state),
        trigger: Trigger.set,
      }))
    } else {
      setTraceState({
        state: newState,
        trigger: Trigger.set,
      })
    }
  })

  useUpdateEffect(() => {
    switch (trigger) {
      case Trigger.trace: {
        onChangeByTrace?.(state)
        return
      }
      case Trigger.set: {
        onChangeBySet?.(state)
        return
      }
      default:
        break
    }
  }, [state])

  return [state, setState, trigger] as const
}
