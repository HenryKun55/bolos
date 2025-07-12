import { forwardRef } from 'react'
import { Text, TextInput, View } from 'react-native'
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
    return (
      <View className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <Text
            className={cn('text-base font-medium text-stone-700', labelClasses)}
          >
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'border bg-stone-50 border-stone-300 text-stone-900 text-base py-3 px-4 rounded-lg focus:border-sky-500',
            inputClasses
          )}
          placeholderTextColor="#9ca3af" // gray-400
          {...props}
        />
      </View>
    )
  }
)

interface InputFormProps<T extends FieldValues> extends UseControllerProps<T> {
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
      name={name}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <View>
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...inputProps}
            inputClasses={cn(
              inputProps?.inputClasses,
              error && 'border-red-500'
            )}
          />
          {error?.message && (
            <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  )
}

export { Input, InputForm }
