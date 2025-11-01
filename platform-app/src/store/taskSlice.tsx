import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Task {
  id: number
  title: string
  completed: boolean
  created_at: string
}

interface TaskState {
  items: Task[]
  loading: boolean
  error: string | null
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetch',
  async () => {
    const { data } = await axios.get<Task[]>(`${API_URL}/tasks`)
    return data
  }
)

export const addTask = createAsyncThunk<Task, { title: string }>(
  'tasks/add',
  async (payload) => {
    const { data } = await axios.post<Task>(`${API_URL}/tasks`, payload)
    return data
  }
)

export const toggleTask = createAsyncThunk<Task, { id: number; completed: boolean }>(
  'tasks/toggle',
  async ({ id, completed }) => {
    const { data } = await axios.patch<Task>(`${API_URL}/tasks/${id}`, { completed })
    return data
  }
)

export const editTask = createAsyncThunk<Task, { id: number; title: string }>(
  'tasks/edit',
  async ({ id, title }) => {
    const { data } = await axios.patch<Task>(`${API_URL}/tasks/${id}`, { title })
    return data
  }
)

export const deleteTask = createAsyncThunk<number, { id: number }>(
  'tasks/delete',
  async ({ id }) => {
    await axios.delete(`${API_URL}/tasks/${id}`)
    return id
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch'
      })

      // Add
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload)
      })

      // Toggle
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })

      // Edit
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) state.items[idx] = action.payload
      })

      // Delete
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
  }
})

export default tasksSlice.reducer