import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

const CARD_BACK = require("../assets/covers/templates/card-back.png");
const CARD_POSITIONS = [
  { left: 31, top: 80, rotate: "-34deg" },
  { left: 72, top: 44, rotate: "-8deg" },
  { left: 116, top: 20, rotate: "2deg" },
  { right: 61, top: 52, rotate: "31deg" },
  { right: 21, top: 102, rotate: "10deg" },
  { left: 32, top: 139, rotate: "-18deg" },
  { left: 112, top: 150, rotate: "-4deg" },
];

export default function SplashScreen() {
  return <SafeAreaView style={s.screen} edges={["top","bottom"]}>
    <View style={s.center}>
      <View style={s.composition}>
        <View style={s.ambient}/>
        {CARD_POSITIONS.map(({rotate,...layout},index)=><Image key={index} source={CARD_BACK} resizeMode="cover" style={[s.card,layout,{transform:[{rotate}]}]}/>)}
        <View style={s.markShadow}/>
        <View style={s.mark}><View style={s.band}/><View style={s.ring}/></View>
        <View style={s.wordmark}><Text style={s.poke}>POKÉ<Text style={s.file}>FILE</Text></Text><View style={s.rule}/><Text style={s.japanese}>ポケファイル</Text><Text style={s.tagline}>PREMIUM REGISTRY INDEX</Text></View>
      </View>
    </View>
    <View style={s.footer}><ActivityIndicator color={colors.purple} size="small" style={s.loader}/><Text style={s.version}>VERSION 1.4.2 · SECURED INDEX</Text></View>
  </SafeAreaView>;
}

const s=StyleSheet.create({
  screen:{flex:1,backgroundColor:"#080808"},center:{flex:1,alignItems:"center",justifyContent:"center"},composition:{width:320,height:340,alignItems:"center"},ambient:{position:"absolute",left:42,right:42,top:42,bottom:42,borderRadius:150,backgroundColor:colors.purple,opacity:.035,shadowColor:colors.purple,shadowOpacity:.5,shadowRadius:75,shadowOffset:{width:0,height:0}},card:{position:"absolute",width:82,height:114,borderRadius:7,borderWidth:1,borderColor:colors.purple,opacity:.26,tintColor:"#8c611c"},markShadow:{position:"absolute",top:84,width:122,height:122,borderRadius:61,backgroundColor:colors.purple,opacity:.08,shadowColor:colors.purple,shadowOpacity:.8,shadowRadius:46,shadowOffset:{width:0,height:0}},mark:{position:"absolute",top:92,width:88,height:88,borderRadius:44,overflow:"hidden",alignItems:"center",justifyContent:"center",backgroundColor:colors.purple},band:{position:"absolute",left:0,right:0,top:39,height:10,backgroundColor:"#080808"},ring:{width:28,height:28,borderRadius:14,borderWidth:4,borderColor:"#080808",backgroundColor:colors.purple},wordmark:{position:"absolute",top:206,alignItems:"center"},poke:{color:"#f4f4f5",fontFamily:"Manrope_800ExtraBold",fontSize:35,letterSpacing:-1.1},file:{fontFamily:"Manrope_300Light",letterSpacing:-1.6},rule:{position:"absolute",left:2,top:44,width:82,height:2,backgroundColor:"#f4f4f5"},japanese:{position:"absolute",right:0,top:40,color:"#f4f4f5",fontSize:7,letterSpacing:.5},tagline:{color:colors.purple,fontFamily:"Manrope_500Medium",fontSize:9,letterSpacing:.25,marginTop:0},footer:{height:72,paddingBottom:10,alignItems:"center",justifyContent:"flex-end"},loader:{marginBottom:7,transform:[{scale:.65}]},version:{color:"#606067",fontFamily:"Manrope_400Regular",fontSize:8,letterSpacing:.2}
});
