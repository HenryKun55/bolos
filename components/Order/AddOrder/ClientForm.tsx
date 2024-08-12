import { Picker } from '@react-native-picker/picker'
import { Control, Controller, useFieldArray } from 'react-hook-form'
import { View, Text, Button } from 'react-native'
import { FormData } from './validator'
import { useFetchClients } from '@/database/api/clients'
import { ProductForm } from './ProductForm'
import { useAndroidPlatform } from '@/hooks/usePlatform'

type ClientFormProps = {
  control: Control<FormData>
}

const ClientForm = ({ control }: ClientFormProps) => {
  const isAndroid = useAndroidPlatform()
  const { data } = useFetchClients()
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'clients',
  })

  return (
    <View>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          render={({ field: { value, onChange, onBlur, disabled } }) => (
            <View className="mb-2">
              <Text className="text-white">Escolha o cliente</Text>
              <Picker
                selectedValue={value.clientId}
                onValueChange={(itemValue, _) => {
                  onChange({ ...value, clientId: itemValue })
                }}
                onBlur={onBlur}
                enabled={disabled}
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
              <ProductForm nestedIndex={index} control={control} />
              <Button
                title="Remover cliente"
                color={isAndroid ? '' : 'white'}
                onPress={() => remove(index)}
              />
            </View>
          )}
          control={control}
          name={`clients.${index}`}
        />
      ))}
      <Button
        title="Adicionar Cliente"
        color={isAndroid ? '' : 'white'}
        onPress={() =>
          append({
            clientId: data?.length ? data[0].id : '0',
            products: [],
          })
        }
      />
    </View>
  )
}

export { ClientForm }
