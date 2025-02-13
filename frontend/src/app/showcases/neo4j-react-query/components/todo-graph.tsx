'use client';

import { useEffect, useRef } from 'react';
import { useUIStore } from '../stores/ui-store';
import { useTodos } from '../hooks/use-todos';
import * as d3 from 'd3';

// 定义 D3 相关的类型
interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  completed: boolean;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: D3Node;
  target: D3Node;
}

export function TodoGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { todos, relations } = useTodos();
  const { setSelectedTodoId } = useUIStore();

  useEffect(() => {
    if (!svgRef.current || !todos.length) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 清除现有内容
    svg.selectAll('*').remove();

    // 准备数据
    const nodes: D3Node[] = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
    }));

    // 创建节点映射以便查找
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // 准备连接，使用节点对象而不是 ID
    const links: D3Link[] = relations.map(relation => ({
      source: nodeMap.get(relation.source)!,
      target: nodeMap.get(relation.target)!,
    }));

    // 创建力导向图布局
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 创建连线
    const links_g = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // 创建箭头标记
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // 创建节点
    const nodes_g = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, D3Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // 添加圆形背景
    nodes_g.append('circle')
      .attr('r', 20)
      .attr('fill', d => d.completed ? '#10B981' : '#3B82F6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // 添加文本标签
    nodes_g.append('text')
      .text(d => d.title.slice(0, 2))
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', '#fff')
      .style('font-size', '12px');

    // 添加悬停标题
    nodes_g.append('title')
      .text(d => d.title);

    // 添加点击事件
    nodes_g.on('click', (_event, d) => {
      setSelectedTodoId(d.id);
    });

    // 更新力导向图
    simulation.on('tick', () => {
      links_g
        .attr('x1', d => d.source.x ?? 0)
        .attr('y1', d => d.source.y ?? 0)
        .attr('x2', d => d.target.x ?? 0)
        .attr('y2', d => d.target.y ?? 0);

      nodes_g.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // 拖拽函数
    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [todos, relations, setSelectedTodoId]);

  return (
    <div className="w-full h-[600px] bg-background rounded-lg border">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
} 