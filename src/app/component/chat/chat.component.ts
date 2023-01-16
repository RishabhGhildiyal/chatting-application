import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { UserDataService } from 'src/app/services/user-data.service';
import {
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(
    private chatService: ChatServiceService,
    public userData: UserDataService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  display = false;
  userName: any;
  newMessage: string='';
  messageList: string[] = [];
  socket: any;
  personId: any;
  activeUserArray: any[] = [];
  roomId: any;
  personName: String = this.userData.userList[0].name;
  phoneNo!: Number;
  commonRoomId: any;
  sendmessage: any;
  storageArray: any[] = [];
  messageArray: any[] = [];
  roomName: any;
  createdGroups: any[] = [];
  joinedMessage: any;
  show = false;
  chatData: any;
  chatForm!: FormGroup;
  readMore=false;
  ngOnInit() {
    this.chatForm = this.fb.group({
      sendMessage: [],
    });

    this.socket = this.chatService.getSocketID();
    let socket = this.chatService.getSocketID();

    socket.on('connect', () => {
      socket.emit('echo', this.userData.userList[0].name);
      this.personId = socket.id;
      this.userData.userList[0].socketID = this.personId;
    });

    socket.on('array', (allUsersArray: any[]) => {
      this.activeUserArray = allUsersArray.filter((item) => {
        return this.personId != item.socketID;
      });
    });

    socket.on('group create', (message: any) => {
      this.activeUserArray = message.filter((item: any) => {
        return this.personId != item.socketID;
      });
    });
    this.chatService.getMessageFromGroup().subscribe((message: any) => {
      this.messageList.push(message);
      this.storageArray = this.chatService.getStorage();
      const storeIndex = this.storageArray.findIndex(
        (Storage) => {
          return Storage.roomId == this.roomName;
        }
      );

      if (storeIndex > -1) {
        this.storageArray = this.chatService.getStorage();
        this.messageArray = this.storageArray[storeIndex].chats;
      }
    });

    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
      this.storageArray = this.chatService.getStorage();
      const storeIndex = this.storageArray.findIndex(
        (Storage) => {
          return (
            (Storage.roomId?.slice(0, 20) == this.roomId ||
              Storage.roomId?.slice(20, 40) == this.roomId) &&
            (Storage.roomId?.slice(0, 20) ==
              this.userData.userList[0].socketID ||
              Storage.roomId?.slice(20, 40) ==
                this.userData.userList[0].socketID)
          );
        }
      );

      if (storeIndex > -1) {
        this.messageArray = this.storageArray[storeIndex].chats;
      } else {
        let updatedStorage = {
          roomId: this.commonRoomId,
          chats: [
            {
              user: this.personName,
              message: this.newMessage,
            },
          ],
        };
        this.storageArray.push(updatedStorage);
      }
    });
  }

  openDialogue() {}

  sendMessage() {
    if (this.newMessage?.trim().length != 0) {
      this.roomName = null;
      this.sendmessage = this.newMessage;
      this.chatService.sendMessage(this.newMessage, this.roomId);

      this.storageArray = this.chatService.getStorage();
      const storeIndex = this.storageArray.findIndex((Storage: any) => {
        return (
          ((Storage.roomId?.slice(0, 20) == this.roomId ||
            Storage.roomId?.slice(20, 40) == this.roomId) &&
            (Storage.roomId?.slice(0, 20) ==
              this.userData.userList[0].socketID ||
              Storage.roomId?.slice(20, 40) ==
                this.userData.userList[0].socketID)) ||
          Storage.roomId == this.commonRoomId
        );
      });

      if (storeIndex > -1) {
        this.storageArray[storeIndex].chats.push({
          user: this.personName,
          message: this.newMessage,
        });
        this.messageArray = this.storageArray[storeIndex].chats;
      } else {
        let updatedStorage = {
          roomId: this.commonRoomId,
          chats: [
            {
              user: this.personName,
              message: this.newMessage,
            },
          ],
        };
        this.storageArray.push(updatedStorage);

        this.messageArray = updatedStorage.chats;
      }

      this.chatService.setStorage(this.storageArray);

      this.newMessage = '';
    } else {
      this.snackbar.open('Enter A Message First', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass:['mat-toolbar','mat-accent']
      });
    }

  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  selectedUserName!: String;

  userSelected(selectedUser?: any) {
    this.chatData = selectedUser;
    this.userName = selectedUser.name;
    this.roomId = selectedUser?.socketID;
    this.selectedUserName = selectedUser?.name;
    if (this.roomId) {
      this.commonRoomId = this.roomId + this.userData.userList[0].socketID;
    } else {
      this.commonRoomId = this.selectedUserName;
      this.joinGroup(this.selectedUserName);
    }
    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex(
      (Storage) => {
        return (
          ((Storage.roomId?.slice(0, 20) == this.roomId ||
            Storage.roomId?.slice(20, 40) == this.roomId) &&
            (Storage.roomId?.slice(0, 20) ==
              this.userData.userList[0].socketID ||
              Storage.roomId?.slice(20, 40) ==
                this.userData.userList[0].socketID)) ||
          Storage.roomId == this.commonRoomId
        );
      }
    );
    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    } else {
      this.messageArray = [];
    }
    this.show = true;
    this.display = true;
  }

  groups: any;

  groupCreated(groupName: any) {
    if (groupName) {
      this.roomName = groupName;
      this.groups = {
        name: this.roomName,
      };
      this.socket.emit('group create', this.groups);
    }
    else{
      this.snackbar.open('Please Enter A Group Name First', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass:['mat-toolbar','mat-accent']

      });
    }
  }

  joinGroup(groupName: any) {
    this.roomName = groupName;
    this.groups = {
      name: this.roomName,
      personName: this.personName,
    };
    this.chatService
      .getSocketID()
      .emit('join-room', this.groups, (message: any) => {
        if (message) {
          this.joinedMessage = message;
        }
      });
  }

  sendMessageToRoom(inputValue?: any) {
    if (this.newMessage?.trim().length != 0) {
      this.chatService
        .sendMessageToGroup(this.newMessage, this.roomName)
        .subscribe((message: any) => {
          this.messageList.push(message);
          this.storageArray = this.chatService.getStorage();
          const storeIndex = this.storageArray.findIndex(
            (Storage) => {
              return Storage.roomId == this.commonRoomId;
            }
          );
          if (storeIndex > -1) {
            this.storageArray[storeIndex].chats.push({
              user: this.personName,
              message: this.newMessage,
            });
            this.messageArray = this.storageArray[storeIndex].chats;
          } else {

            let updatedStorage = {
              roomId: this.commonRoomId,
              chats: [
                {
                  user: this.personName,
                  message: this.newMessage,
                },
              ],
            };
            this.storageArray.push(updatedStorage);
            this.messageArray = updatedStorage.chats;
          }

          this.chatService.setStorage(this.storageArray);
        });
      this.newMessage = '';
      this.chatService.getMessageFromGroup();
    } else {
      this.snackbar.open('Please Enter A Message First', 'close', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass:['mat-toolbar','mat-warn']
      });
    }
  }
  logout() {
    this.socket.disconnect()
    this.router.navigate(['/login'])
  }
}
