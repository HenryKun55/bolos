import { Input } from '@/components/Input'
import { useFetchProducts } from '@/database/api/products'
import { Picker } from '@react-native-picker/picker'
import { Control, Controller, useFieldArray } from 'react-hook-form'
import { View, Button } from 'react-native'
import { FormData } from '../validator'

type NestedProductInputProps = {
  nestedIndex: number
  control: Control<FormData>
}

const NestedProductInput = ({
  control,
  nestedIndex,
}: NestedProductInputProps) => {
  const { data } = useFetchProducts()
  const { fields, remove, append } = useFieldArray({
    control,
    name: `clients.${nestedIndex}.products`,
  })

  return (
    <View>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`clients.${nestedIndex}.products.${index}`}
          render={({ field: { onBlur, onChange, value, disabled } }) => (
            <View className="flex-row items-center">
              <Picker
                selectedValue={value.productId}
                onValueChange={(itemValue, _) => {
                  onChange({ productId: itemValue, amount: value.amount })
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
                    color="white"
                  />
                ))}
              </Picker>

              <Input
                onBlur={onBlur}
                value={value?.amount?.toString()}
                onChangeText={(text) => {
                  onChange({
                    productId: value.productId,
                    amount: Number(text) ?? 1,
                  })
                }}
                keyboardType="number-pad"
                editable={disabled}
                className="text-white border-white"
              />
              <Button
                title="Remover"
                color="white"
                onPress={() => remove(index)}
              />
            </View>
          )}
        />
      ))}
      <Button
        title="Adicionar produto"
        color="white"
        onPress={() =>
          append({ productId: data?.length ? data[0].id : '0', amount: 1 })
        }
      />
    </View>
  )
}

export { NestedProductInput }
