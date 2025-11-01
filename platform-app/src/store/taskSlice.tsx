import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Todo {
  id: number
  title: string
  completed: boolean
  created_at: string
}

interface TodosState {
  items: Todo[]
  loading: boolean
  error: string | null
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const fetchTodos = createAsyncThunk<Todo[]>(
  'todos/fetch',
  async () => {
    const { data } = await axios.get<Todo[]>(`${API_URL}/todos`)
    return data
  }
)

export const addTodo = createAsyncThunk<Todo, { title: string }>(
  'todos/add',
  async (payload) => {
    const { data } = await axios.post<Todo>(`${API_URL}/todos`, payload)
    return data
  }
)

export const toggleTodo = createAsyncThunk<Todo, { id: number; completed: boolean }>(
  'todos/toggle',
  async ({ id, completed }) => {
    const { data } = await axios.patch<Todo>(`${API_URL}/todos/${id}`, { completed })
    return data
  }
)

export const editTodo = createAsyncThunk<Todo, { id: number; title: string }>(
  'todos/edit',
  async ({ id, title }) => {
    const { data } = await axios.patch<Todo>(`${API_URL}/todos/${id}`, { title })
    return data
  }
)

export const deleteTodo = createAsyncThunk<number, { id: number }>(
  'todos/delete',
  async ({ id }) => {
    await axios.delete(`${API_URL}/todos/${id}`)
    return id
  }
)

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch'
      })

      // Add
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.items.unshift(action.payload)
      })

      // Toggle
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })

      // Edit
      .addCase(editTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })

      // Delete
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  }
})

export default todosSlice.reducer