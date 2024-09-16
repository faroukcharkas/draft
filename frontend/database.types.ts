export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      author: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "author_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      document: {
        Row: {
          body: Json | null
          created_at: string
          format_version: number | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          body?: Json | null
          created_at?: string
          format_version?: number | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Update: {
          body?: Json | null
          created_at?: string
          format_version?: number | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_chunk: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          sample_id: string | null
          writing_style: Database["public"]["Enums"]["writing_style"]
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          sample_id?: string | null
          writing_style: Database["public"]["Enums"]["writing_style"]
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          sample_id?: string | null
          writing_style?: Database["public"]["Enums"]["writing_style"]
        }
        Relationships: [
          {
            foreignKeyName: "sample_chunk_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sample_chunk_sample_id_fkey"
            columns: ["sample_id"]
            isOneToOne: false
            referencedRelation: "writing_sample"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      writing_sample: {
        Row: {
          created_at: string
          id: string
          text: string | null
          writing_style: Database["public"]["Enums"]["writing_style"]
        }
        Insert: {
          created_at?: string
          id?: string
          text?: string | null
          writing_style: Database["public"]["Enums"]["writing_style"]
        }
        Update: {
          created_at?: string
          id?: string
          text?: string | null
          writing_style?: Database["public"]["Enums"]["writing_style"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      writing_style: "FORMAL" | "CASUAL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
