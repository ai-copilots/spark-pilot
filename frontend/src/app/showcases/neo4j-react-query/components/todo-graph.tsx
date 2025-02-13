'use client';

import { useEffect, useRef } from 'react';
import { useUIStore } from '../stores/ui-store';
import { useTodos } from '../hooks/use-todos';
import * as d3 from 'd3';

export function TodoGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { todos, relations } = useTodos();
  const { graphSettings, setSelectedTodoId } = useUIStore();

  useEffect(() => {
    if (!svgRef.current || !todos.length) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 清除现有内容
    svg.selectAll('*').remove();

    // 创建力导向图布局
    const simulation = d3.forceSimulation(todos)
      .force('link', d3.forceLink(relations)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 创建连线
    const links = svg.append('g')
      .selectAll('line')
      .data(relations)
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
    const nodes = svg.append('g')
      .selectAll('g')
      .data(todos)
      .enter()
      .append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // 添加圆形背景
    nodes.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => d.completed ? '#10B981' : '#3B82F6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // 添加文本标签
    nodes.append('text')
      .text((d: any) => d.title.slice(0, 2))
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('fill', '#fff')
      .style('font-size', '12px');

    // 添加悬停标题
    nodes.append('title')
      .text((d: any) => d.title);

    // 添加点击事件
    nodes.on('click', (event: any, d: any) => {
      setSelectedTodoId(d.id);
    });

    // 更新力导向图
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
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