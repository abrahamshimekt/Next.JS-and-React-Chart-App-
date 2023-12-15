import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";
import { getToken, removeToken } from "@/utils/authHelper";

interface Group {
  id: number;
  name: string;
}

interface EmailReceipentArgs {
  logoutCallback?: () => void;
}

interface Recipient {
  id: number;
  email: string;
  groups: Group[];
}

const transformData = (
  groups: Group[],
  recipients: Recipient[]
): { group: string; id: number; data: { email: string; id: number }[] }[] => {
  const data: {
    group: string;
    id: number;
    data: { email: string; id: number }[];
  }[] = [];

  // Map recipients to their groups to avoid duplicates
  const recipientsByGroup = recipients.reduce((acc, recipient) => {
    recipient.groups.forEach((group) => {
      if (!acc[group.name]) {
        acc[group.name] = { group: group.name, id: group.id, data: [] };
      }
      acc[group.name].data.push({ email: recipient.email, id: recipient.id });
    });
    return acc;
  }, {} as { [groupName: string]: { group: string; id: number; data: { email: string; id: number }[] } });

  // Convert object to array for final data
  return Object.values(recipientsByGroup);
};

export const loadRecipientGroups = createAsyncThunk(
  "emailRecipients/get_recipient_groups",
  async ({ logoutCallback }: EmailReceipentArgs, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (token == undefined) {
        throw new Error("UnAuthorized");
      }

      // get recipients groups
      const groupsResponse = await axios.get(
        `${API_URL}/api/recipient-groups/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      const recipientGroups = groupsResponse.data;

      // get group recipients
      const recipientsResponse = await axios.get(`${API_URL}/api/recipients/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });

      const groupRecipients = recipientsResponse.data;

      const data = transformData(recipientGroups, groupRecipients);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logoutCallback?.();

        return rejectWithValue("Unauthorized - Logged Out");
      }
      return rejectWithValue("something went wrong");
    }
  }
);
