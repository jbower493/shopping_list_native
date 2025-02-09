import { _ComboBox } from './component'
import { _ComboBoxHookFormWrapper } from './hookFormWrapper'

export const ComboBox = Object.assign(_ComboBox, {
    HookForm: _ComboBoxHookFormWrapper
})
