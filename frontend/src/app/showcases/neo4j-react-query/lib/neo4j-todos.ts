import { executeRead, executeWrite } from '../../../../lib/neo4j';
import type { Record as Neo4jRecord } from 'neo4j-driver';

// 数据接口
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface TodoRelation {
  source: string;
  target: string;
  type: 'DEPENDS_ON' | 'BLOCKS';
}

// Neo4j 查询函数
export async function fetchTodos(): Promise<Todo[]> {
  const result = await executeRead<Neo4jRecord>(
    `
    MATCH (t:Todo)
    RETURN t {
      .*,
      id: toString(id(t)),
      dependencies: [(t)-[:DEPENDS_ON]->(d) | toString(id(d))]
    } as todo
    ORDER BY t.createdAt DESC
    `
  );
  return result.map(record => record.get('todo') as Todo);
}

export async function fetchTodoRelations(): Promise<TodoRelation[]> {
  const result = await executeRead<Neo4jRecord>(
    `
    MATCH (t1:Todo)-[r:DEPENDS_ON|BLOCKS]->(t2:Todo)
    RETURN {
      source: toString(id(t1)),
      target: toString(id(t2)),
      type: type(r)
    } as relation
    `
  );
  return result.map(record => record.get('relation') as TodoRelation);
}

export async function createTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
  const result = await executeWrite<Neo4jRecord>(
    `
    CREATE (t:Todo {
      title: $title,
      completed: $completed,
      priority: $priority,
      createdAt: toString(datetime())
    })
    RETURN t {
      .*,
      id: toString(id(t)),
      dependencies: []
    } as todo
    `,
    { ...todo }
  );
  return result[0].get('todo') as Todo;
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  const result = await executeWrite<Neo4jRecord>(
    `
    MATCH (t:Todo)
    WHERE id(t) = toInteger($id)
    SET t += $updates
    RETURN t {
      .*,
      id: toString(id(t)),
      dependencies: [(t)-[:DEPENDS_ON]->(d) | toString(id(d))]
    } as todo
    `,
    { id: parseInt(id), updates }
  );
  return result[0].get('todo') as Todo;
}

export async function deleteTodo(id: string): Promise<void> {
  await executeWrite(
    `
    MATCH (t:Todo)
    WHERE id(t) = toInteger($id)
    DETACH DELETE t
    `,
    { id: parseInt(id) }
  );
}

export async function addDependency(sourceId: string, targetId: string): Promise<void> {
  await executeWrite(
    `
    MATCH (t1:Todo), (t2:Todo)
    WHERE id(t1) = toInteger($sourceId) AND id(t2) = toInteger($targetId)
    MERGE (t1)-[:DEPENDS_ON]->(t2)
    `,
    { sourceId: parseInt(sourceId), targetId: parseInt(targetId) }
  );
}

export async function removeDependency(sourceId: string, targetId: string): Promise<void> {
  await executeWrite(
    `
    MATCH (t1:Todo)-[r:DEPENDS_ON]->(t2:Todo)
    WHERE id(t1) = toInteger($sourceId) AND id(t2) = toInteger($targetId)
    DELETE r
    `,
    { sourceId: parseInt(sourceId), targetId: parseInt(targetId) }
  );
}

export async function fetchTodoDependencyChain(id: string): Promise<Todo[]> {
  const result = await executeRead<Neo4jRecord>(
    `
    MATCH path = (t:Todo)-[:DEPENDS_ON*]->(d:Todo)
    WHERE id(t) = toInteger($id)
    RETURN [node in nodes(path) | node {
      .*,
      id: toString(id(node)),
      dependencies: [(node)-[:DEPENDS_ON]->(dep) | toString(id(dep))]
    }] as chain
    `,
    { id: parseInt(id) }
  );
  return result[0]?.get('chain') || [];
}

export async function fetchBlockedTasks(id: string): Promise<Todo[]> {
  const result = await executeRead<Neo4jRecord>(
    `
    MATCH (t:Todo)<-[:DEPENDS_ON]-(blocked:Todo)
    WHERE id(t) = toInteger($id)
    RETURN blocked {
      .*,
      id: toString(id(blocked)),
      dependencies: [(blocked)-[:DEPENDS_ON]->(d) | toString(id(d))]
    } as todo
    `,
    { id: parseInt(id) }
  );
  return result.map(record => record.get('todo'));
} 