import { Stack } from "expo-router";

//Stack permet la navigation entre chaque écran, 
//Stack.Screen représente un écran de la pile de navigation

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name = 'index' 
        options={{ 
          headerStyle :{backgroundColor :'black'},
          headerTitle: "Home",
          headerTintColor: 'white',
          headerShadowVisible : false,
          headerShown: false
          }} />
      <Stack.Screen name = 'conversation' 
      options={{
        headerStyle :{backgroundColor :'black'},
        headerTitle: "Conversation",
        headerTintColor: 'white',
        headerShadowVisible : false,
        headerShown: false
      }} />
      <Stack.Screen name = 'historique' 
        options={{ 
          headerStyle :{backgroundColor :'black'},
          headerTitle: "historique",
          headerTintColor: 'white',
          headerShadowVisible : false,
          headerShown: false
          }} />
      <Stack.Screen name = 'parametres' 
        options={{ 
          headerStyle :{backgroundColor :'black'},
          headerTitle: "Parametres",
          headerTintColor: 'white',
          headerShadowVisible : false,
          headerShown: false
          }} />
    </Stack>
  )
}
