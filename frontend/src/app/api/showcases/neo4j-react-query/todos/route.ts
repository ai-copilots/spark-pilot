import { NextResponse } from 'next/server';
import { Neo4jConnectionError } from '@/lib/neo4j';
import {
  fetchTodos,
  fetchTodoRelations,
  createTodo,
  updateTodo,
  deleteTodo,
  addDependency,
  removeDependency,
  fetchTodoDependencyChain,
  fetchBlockedTasks,
} from '@/app/showcases/neo4j-react-query/lib/neo4j-todos';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    let data;
    switch (action) {
      case 'relations':
        data = await fetchTodoRelations();
        break;
      case 'dependency-chain':
        if (!id) {
          return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
          );
        }
        data = await fetchTodoDependencyChain(id);
        break;
      case 'blocked-tasks':
        if (!id) {
          return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
          );
        }
        data = await fetchBlockedTasks(id);
        break;
      default:
        data = await fetchTodos();
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
    const status = error instanceof Neo4jConnectionError && 
      error.cause && 
      typeof error.cause === 'object' && 
      'code' in error.cause && 
      error.cause.code === 'Neo.ClientError.Statement.SyntaxError' 
        ? 400 
        : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'create':
        result = await createTodo(data);
        break;
      case 'update':
        if (!data.id) {
          return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
          );
        }
        result = await updateTodo(data.id, data.updates);
        break;
      case 'delete':
        if (!data.id) {
          return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
          );
        }
        await deleteTodo(data.id);
        result = { success: true };
        break;
      case 'add-dependency':
        if (!data.sourceId || !data.targetId) {
          return NextResponse.json(
            { error: 'Source ID and Target ID are required' },
            { status: 400 }
          );
        }
        await addDependency(data.sourceId, data.targetId);
        result = { success: true };
        break;
      case 'remove-dependency':
        if (!data.sourceId || !data.targetId) {
          return NextResponse.json(
            { error: 'Source ID and Target ID are required' },
            { status: 400 }
          );
        }
        await removeDependency(data.sourceId, data.targetId);
        result = { success: true };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
    const status = error instanceof Neo4jConnectionError && 
      error.cause && 
      typeof error.cause === 'object' && 
      'code' in error.cause && 
      error.cause.code === 'Neo.ClientError.Statement.SyntaxError' 
        ? 400 
        : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
} 