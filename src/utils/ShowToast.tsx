import Toast from 'react-native-tiny-toast'

/**
 * This function is used to facilitate the call of the
 * component Toast from the library 'react-native-tiny-toast'
 */
export const showToast = async (message: string, toastPosition: string = 'bottom', toastDuration: string = 'short') => {
    let duration = Toast.duration.SHORT
    if (toastDuration == 'long')
        duration = Toast.duration.LONG
    //
    let position = Toast.position.BOTTOM
    if (toastPosition == 'center' || toastPosition == 'centre')
        position = Toast.position.CENTER
    else
        //
        if (toastPosition == 'top')
            position = Toast.position.TOP
    //
    Toast.show(message, {
        duration,
        animationDuration: 500,
        position,
        containerStyle: {
            width: '85%',
            borderRadius: 8,
            backgroundColor: '#555'
        }
    })
}
