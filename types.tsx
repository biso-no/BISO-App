import { StyleProp, ViewStyle } from "react-native/types";


    interface UserProfile {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        zip?: string;
        bankAccount?: string;
        bankType?: number;
        bic?: string;
        subunits?: Subunit[];
        campus?: string[];
        pushToken?: string;
        newFeatures?: boolean;
        uid?: string;
      }
      
      interface SwitchProps {
        onClick: (value: boolean) => void;
        mode?: 'horizontal' | 'vertical';
        style?: object;
        isEnabled?: boolean;
        initialValue?: boolean;
        onText?: string;
        offText?: string;
      }

      interface SelectorProps {
        visible: boolean;
        allData: Array<{ id: string; name: string, campus: string }>;
        favoriteData?: Array<{ id: string;  name: string, campus: string }>; // Add the favoriteData prop
        onSelect: (items: Array<{ id: string; name: string, campus: string; org: string }>) => void; // change here
        onClose: () => void;
        selectedItems?: string[]; // Add the selectedItems prop
        enableSearch?: boolean; // Add the enableSearch prop
        multiSelect?: boolean; // Add the multiSelect prop
        enableFavorites?: boolean; // Add the enableFavorites prop
    }
    

      interface ProgressBarData {
        label: string;
        value: number;
        maxValue: number;
      }
      
      interface ProgressBarProps {
        header?: string;
        data: ProgressBarData[];
        style?: ViewStyle;
        valueLabel?: string;
      }

interface NewsPost {
  title: string;
  subtitle: string;
  department: string;
  date: string;
  departmentLogo: string;
  image: string;
  isFeatured?: boolean; // Add the isFeatured property
}

interface NewsListProps {
  newsPosts: NewsPost[];
  onBannerVisibilityChange: (isVisible: boolean) => void;
}

type Subunit = {
  id: string;
  name: string;
  campus: string;
}

interface Attachment {
  id?: string;
  description: string;
  amount: string;
  date: string;
  file: string;
}

//Expense
interface Expense {
  id: string;
  docid?: string;
  invoiceNo?: string;
  address: string;
  attachments: Attachment[];
  bankAccountNumber: string;
  campus: string;
  city: string;
  date: Date;
  department: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  outstanding: number;
  zip: string;
  prepayment: boolean;
  prepaymentAmount?: number;
  purpose: string;
  totalAmount: number;
  uid: string;
  isApproved: boolean;
  lastDocument?: string;
  org?: string;
}

interface Expenses {
  Expenses: Expense[];
}

interface ReimbursementListItemProps {
  item: any;
  onPress: () => void;
  isApproved: boolean;
}

interface BannerProps {
  isAuthenticated: boolean;
  onLoginPress: () => void;
  style?: StyleProp<ViewStyle>;
}

type Candidate = {
  id: string;
  name: string;
};


type Position = {
  id: string;
  name: string;
  candidates: Candidate[];
  status: string;
  isStatuteChange?: boolean;
};

type Vote = {
  id: string;
  candidate: string;
  voterKey: string;
  election: string;
  position: string;
};


interface ElectionProps {
  id: string;              // Unique identifier for the election
  title: string;            // Name of the election
  startDate?: Date;        // Optional start date of the election
  endDate?: Date;          // Optional end date of the election
  description?: string;    // Optional description of the election
  isActive?: boolean;      // Optional flag indicating if the election is active
  voterKeyRequired?: boolean; // Optional flag indicating if a voter key is required to vote
  // ... any other attributes you might have
}


interface ActiveVotingSession {
  id?: string;
  positions: Position[];
  status?: string;
  election: string;
  voterKey: string;
}
type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  expirationDate?: string;
};




export { Attachment, UserProfile, SwitchProps, SelectorProps, ProgressBarData, ProgressBarProps, NewsPost, NewsListProps, Subunit, Expense, Expenses, ReimbursementListItemProps, BannerProps, Candidate, Position, ElectionProps, ActiveVotingSession, Vote, Product };