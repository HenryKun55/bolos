import { Control, Controller, useFieldArray } from 'react-hook-form'
import { Button, View } from 'react-native'
import { FormData } from './validator'
import { useFetchProducts } from '@/database/api/products'
import { Picker } from '@react-native-picker/picker'
import { Input } from '@/components/Input'
import { useAndroidPlatform } from '@/hooks/usePlatform'
import { cn } from '@/lib/utils'

type ExchangeFormProps = {
  control: Control<FormData>
}

export const ExchangeForm = ({ control }: ExchangeFormProps) => {
  const isAndroid = useAndroidPlatform()
  const { data } = useFetchProducts()
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'exchanges',
  })

  return (
    <View>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`exchanges.${index}`}
          render={({ field: { onBlur, onChange, value, disabled } }) => (
            <View className="flex-row items-center mb-2">
              <Picker
                selectedValue={value.productId}
                onValueChange={(productId, _) => {
                  onChange({ ...value, productId })
                }}
                onBlur={onBlur}
                enabled={disabled}
                style={{ flex: 1 }}
                itemStyle={{ height: 60 }}
              >
                {data?.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.id}
                    color={isAndroid ? '' : 'white'}
                  />
                ))}
              </Picker>

              <Input
                onBlur={onBlur}
                value={value?.amount?.toString()}
                onChangeText={(text) => {
                  onChange({
                    ...value,
                    amount: Number(text) ?? 1,
                  })
                }}
                keyboardType="number-pad"
                editable={disabled}
                className={cn(
                  'text-white border-white',
                  isAndroid ? 'mx-2' : ''
                )}
              />
              <Button
                title="Remover"
                color={isAndroid ? '' : 'white'}
                onPress={() => remove(index)}
              />
            </View>
          )}
        />
      ))}
      <Button
        title="Adicionar Troca"
        color={isAndroid ? '' : 'white'}
        onPress={() =>
          append({
            productId: data?.length ? data[0].id : '0',
            amount: 1,
          })
        }
      />
    </View>
  )
}
