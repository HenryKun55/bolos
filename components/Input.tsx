import { forwardRef } from 'react'
import { Text, TextInput, View, useColorScheme } from 'react-native'

import { cn } from '../lib/utils'
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form'

export interface InputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string
  labelClasses?: string
  inputClasses?: string
}

const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, labelClasses, inputClasses, ...props }, ref) => {
    const theme = useColorScheme() ?? 'light'

    return (
      <View className={cn('flex flex-col gap-2.5', className)}>
        {label && (
          <Text className={cn('text-base text-white', labelClasses)}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            inputClasses,
            'border border-input py-2.5 px-4 rounded-lg'
          )}
          placeholderTextColor={theme === 'light' ? 'black' : 'white'}
          {...props}
        />
      </View>
    )
  }
)

interface InputFormProps<T extends FieldValues> extends UseControllerProps<T> {
  className?: string
  inputProps?: InputProps
}

function InputForm<T extends FieldValues>({
  name,
  control,
  inputProps,
}: InputFormProps<T>) {
  return (
    <Controller
      control={control}
      render={({
        field: { onBlur, onChange, value, disabled },
        fieldState: { error },
      }) => (
        <View>
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={disabled}
            {...inputProps}
          />
          {error?.message && (
            <Text className="text-red-500 py-2">{error.message}</Text>
          )}
        </View>
      )}
      name={name}
    />
  )
}

export { Input, InputForm }
