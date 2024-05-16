
import { Component } from 'rete'

export async function createNode (component: Component, position: { x: number, y: number }, data: Record<string, unknown>) {
  const node = await component.createNode(data)

  node.position = [position.x, position.y]

  return node
}
