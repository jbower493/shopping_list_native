import { MessageOptions, showMessage } from 'react-native-flash-message'
import { semantic } from '../designTokens'

export function flashMessage(options: Pick<MessageOptions, 'message'> & { type: 'success' | 'error' | 'info' }) {
    function getBackgroundColor() {
        switch (options.type) {
            case 'success':
                return semantic.colorBackgroundSuccess
            case 'error':
                return semantic.colorBackgroundError
            case 'info':
                return semantic.colorBackgroundInfo
            default:
                return semantic.colorBackgroundSecondary
        }
    }

    showMessage({
        message: options.message,
        backgroundColor: getBackgroundColor()
    })
}
