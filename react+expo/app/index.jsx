import {
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
  Image,
  Modal,
  RefreshControl,
} from "react-native";
import { MainLayout } from "@/components/CustomComponents";
import { useEffect, useState } from "react";
import { retrieve, register, update, destroy } from "@/api/user";
import { FontAwesome } from "@expo/vector-icons";
import { Button, FAB, TextInput } from "react-native-paper";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function Index() {
  const [names, setNames] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [select, setSelect] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState("");
  const [groupname, setGroupName] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    retrieve().then((res) => {
      setNames(res.data);
      console.log(res.data);
    });
  }, []);

  const handleItemName = (item) => {
    setSelect(item);
    setShowOptions(true);
  };

  const handeDelete = () => {
    destroy({ id: select.id })
      .then((res) => {
        console.log(res);
        if (res?.ok) {
          onRefresh();
          toast.success(res?.message ?? "User has been deleted");
        } else {
          toast.error(res?.message ?? "Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setShowConfirm(false);
      });
  };
  const handleEdit = () => {
    update({
      id: select.id,
      name,
      groupname,
      country,
      age,
      thumbnail,
    })
      .then((res) => {
        console.log(res);
        if (res?.ok) {
          onRefresh();
          toast.success(res?.message ?? "User has been updated");

          setName("");
          setGroupName("");
          setCountry("");
          setAge("");
          setThumbnail("");
        } else {
          toast.error(res?.message ?? "Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setEditDialog(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    retrieve()
      .then((res) => {
        setNames(res.data);
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  };
  const goToAddPage = () => {
    register({
      name: name,
      groupname: groupname,
      country: country,
      age: age,
      thumbnail: thumbnail,
    })
      .then((res) => {
        if (res?.ok) {
          onRefresh();
          toast.success(res?.message ?? "User has been added");
          setName("");
          setGroupName("");
          setCountry("");
          setAge("");
          setThumbnail("");
        } else {
          toast.error(res?.message ?? "Something went wrong");
        }
      })
      .catch((e) => {
        console.log(e.message);
      })
      .finally(() => {
        setAddDialog(false);
      });
  };

  return (
    <MainLayout>
      {/* options modal */}
      <Modal animationType="fade" transparent={true} visible={showOptions}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={styles.modalView}>
            {/* title */}
            <Text
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              What do you want to do with name {select.name}
            </Text>
            <Button
              rippleColor="#aaa"
              icon="movie-edit"
              textColor="#fff"
              style={{
                width: "90%",
                backgroundColor: "#007bff",
                marginBottom: 20,
              }}
              onPress={() => {}}
            >
              <Text
                style={{
                  fontSize: 16,
                  padding: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onPress={() => {
                  setShowOptions(false);
                  setEditDialog(true);
                }}
              >
                Update Idol Name
              </Text>
            </Button>
            <Button
              rippleColor="#aaa"
              icon="delete"
              textColor="#fff"
              style={{
                width: "90%",
                backgroundColor: "#007bff",
                marginBottom: 20,
              }}
              onPress={() => {
                setShowOptions(false);
                setShowConfirm(true);
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  padding: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Delete This Idol Name
              </Text>
            </Button>
            <Button
              rippleColor="#aaa"
              icon="close"
              textColor="#fff"
              style={{
                width: "90%",
                backgroundColor: "#a10002",
              }}
              onPress={() => setShowOptions(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  padding: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
      {/* confirm/ delete modal */}
      <Modal animationType="fade" transparent={true} visible={showConfirm}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={styles.modalView}>
            {/* title */}
            <Text
              style={{
                marginBottom: 30,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Do you want to do delete this idol name: {select.name}?
            </Text>
            <View
              style={
                Platform.OS == "web"
                  ? { flexDirection: "row-reverse", justifyContent: "center" }
                  : { justifyContent: "center" }
              }
            >
              <Button
                rippleColor="#aaa"
                icon="check"
                textColor="#fff"
                style={{
                  width: "90%",
                  backgroundColor: "#28a745",
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={() => handeDelete()}
              >
                <Text
                  style={{
                    fontSize: 16,
                    padding: 3,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Yes
                </Text>
              </Button>
              <Button
                rippleColor="#aaa"
                icon="close"
                textColor="#fff"
                style={{
                  width: "90%",
                  backgroundColor: "#a10002",
                  marginLeft: 5,
                  marginRight: 5,
                }}
                onPress={() => {
                  setShowOptions(true);
                  setShowConfirm(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  No
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {/* Edit modal */}
      <Modal animationType="fade" transparent={true} visible={editDialog}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text
              style={{
                marginBottom: 20,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Edit Idol Info
            </Text>
            <TextInput
              label="Idol Name"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={name}
              onChangeText={setName}
              id="name"
            />
            <TextInput
              label="Group Name"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={groupname}
              onChangeText={setGroupName}
              id="groupname"
            />
            <TextInput
              label="Country"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={country}
              onChangeText={setCountry}
              id="country"
            />
            <TextInput
              label="Age"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={age}
              onChangeText={setAge}
              id="country"
            />
            <TextInput
              label="Thumbnail"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={thumbnail}
              onChangeText={setThumbnail}
              id="thumbnail"
            />
            <Button
              onPress={handleEdit}
              mode="contained"
              style={{ marginTop: 20, backgroundColor: "#007bff" }}
            >
              Save Changes
            </Button>
            <Button
              onPress={() => {
                setEditDialog(false);
                setName("");
                setGroupName("");
                setCountry("");
                setAge("");
                setThumbnail("");
              }}
              mode="outlined"
              style={{ marginTop: 10, borderColor: "#007bff" }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
      {/* Add Modal */}
      <Modal animationType="fade" transparent={true} visible={addDialog}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text
              style={{
                marginBottom: 20,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Add Idol Character
            </Text>
            <TextInput
              label="Idol Name"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={name}
              onChangeText={setName}
              id="name"
            />
            <TextInput
              label="Group Name"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={groupname}
              onChangeText={setGroupName}
              id="groupname"
            />
            <TextInput
              label="Country"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={country}
              onChangeText={setCountry}
              id="country"
            />
            <TextInput
              label="Age"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={age}
              onChangeText={setAge}
              id="age"
            />
            <TextInput
              label="Thumbnail"
              mode="outlined"
              style={{ marginBottom: 10 }}
              value={thumbnail}
              onChangeText={setThumbnail}
              id="thumbnail"
            />
            <Button
              onPress={goToAddPage}
              mode="contained"
              style={{ marginTop: 20, backgroundColor: "#007bff" }}
            >
              Save Changes
            </Button>
            <Button
              onPress={() => {
                setAddDialog(false);
                setName("");
                setGroupName("");
                setCountry("");
                setAge("");
                setThumbnail("");
              }}
              mode="outlined"
              style={{ marginTop: 10, borderColor: "#007bff" }}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
      <ToastContainer />
      {/* FlatList = RecyclerView */}
      <FlatList
        data={names}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable
            android_ripple={{ color: "#eee" }}
            style={
              Platform.OS == "android"
                ? styles.elevate
                : ({ pressed }) => [
                    styles.elevate,
                    { backgroundColor: pressed ? "#aaa" : null },
                  ]
            }
            onPress={() => handleItemName(item)}
          >
            <Image
              source={item.groupname != "" ? { uri: item.thumbnail } : {}}
              style={{ width: "100%", height: 250, marginBottom: 12 }}
              resizeMode={Platform.OS == "web" ? "contain" : "cover"}
            />

            <Text
              style={{
                fontSize: 24,
                padding: 10,
                color: "#f52",
                fontWeight: "bold",
              }}
            >
              <FontAwesome name="star-o" size={24} /> {item.name}
            </Text>
            <Text
              style={{
                padding: 10,
                fontWeight: "bold",
                background: "darkgray",
              }}
            >
              Age: {item.age}
            </Text>
            <Text
              style={{
                padding: 10,
                fontWeight: "bold",
                background: "darkgray",
              }}
            >
              Group name: {item.groupname}
            </Text>
            <Text
              style={{
                padding: 10,
                fontWeight: "bold",
                background: "darkgray",
              }}
            >
              Country: {item.country}
            </Text>
          </Pressable>
        )}
      />

      {/* FAB short term of Floating action Button lol hHhahahaaah rawr */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: "#28a745",
        }}
        rippleColor="#fff"
        color="#fff"
        mode="elevated"
        onPress={() => {
          setShowOptions(false);
          setAddDialog(true);
        }}
      />

      <FAB
        icon="refresh"
        style={{
          position: "absolute",
          margin: 16,
          left: 0,
          bottom: 0,
          backgroundColor: "#007bff",
        }}
        rippleColor="#fff"
        color="#fff"
        mode="elevated"
        onPress={() => onRefresh()}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  elevate: {
    flex: 1,
    margin: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    // shadowRadius: 2,
    borderBlockColor: "#000",
  },
  modalView: {
    width: "90%",
    minHeight: "10%",
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
