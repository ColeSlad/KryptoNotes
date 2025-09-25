import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Href, Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function Menu(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <Link href="/" asChild>
        <TouchableOpacity style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>Home</Text>
        </TouchableOpacity>
      </Link>

      <Link href={"/Login" as Href} asChild>
        <TouchableOpacity style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>Login</Text>
        </TouchableOpacity>
      </Link>

      <Link href={"/Register" as Href} asChild>
        <TouchableOpacity style={{ padding: 16 }}>
          <Text style={{ fontSize: 16 }}>Register</Text>
        </TouchableOpacity>
      </Link>
    </DrawerContentScrollView>
  );
}
