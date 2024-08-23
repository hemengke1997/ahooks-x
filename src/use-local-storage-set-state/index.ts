import { type SetRequired } from 'type-fest'
import { type Options } from '../create-use-storage-state'
import { type StateType, useSetStatePlugin } from '../use-set-state-plugin'

export function useLocalStorageSetState<T extends StateType>(
  key: string,
  options: SetRequired<Options<T>, 'defaultValue'>,
) {
  return useSetStatePlugin(options.defaultValue!, {
    storage: {
      api: localStorage,
      key,
      options: options as Options<T>, // Explicitly cast options to Options<T | undefined>
    },
  })
}
