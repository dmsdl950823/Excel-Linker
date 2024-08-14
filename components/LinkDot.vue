<template>
  <NSpace justify="center" align="center" vertical>
    <h2>컬럼 연결하기</h2>
    
    <!-- {{  activeNodes  }} -->
  
    <NTag
      v-for="status in showConnectedStatus()"
      :key="status"
    >
      {{ status }}
    </NTag>


    <NSpace justify="space-between" :size="100" class="column-area">
      <NSpace justify="center" align="center" vertical>
        <NButton
          v-for="node in nodes1"
          :key="node.id"
          tertiary
          round
          strong
          :ref="el => setNodeRef(node.id, el)"
          :secondary="isSelected(node)"
          :type="isConnected(node, 'primary')"
          @click="handleNodeClickEvent(node)"
        >
          {{ node.label }}
          <!-- -> {{ node.connected }} -->
        </NButton>
      </NSpace>

      <!-- <NSpace>
        <svg width="300" height="600" ref="svgRef">
          <path :d="svgPath" fill="none" stroke="#000" stroke-width="2" />
        </svg>
      </NSpace> -->

      <NSpace justify="center" align="center" vertical>
        <NButton
          v-for="node in nodes2"
          :key="node.id"
          tertiary
          round
          strong
          :ref="el => setNodeRef(node.id, el)"
          :secondary="isSelected(node)"
          :type="isConnected(node, 'info')"
          @click="handleNodeClickEvent(node)"
        >
          {{ node.label }}
          <!-- -> {{ node.connected }} -->
        </NButton>
      </NSpace>
    </NSpace>

    <NSpace class="button-area">
      <NButton secondary size="large">
        뒤로가기
      </NButton>
  
      <NButton type="primary" size="large">
        연결 및 다운로드
      </NButton>
    </NSpace>
  </NSpace>
</template>

<script setup lang="ts">
import { useColumnLinker } from '~/composables/use-column-linker'

const { standardColunms, restColunms } = useColumnLinker()

interface Node {
  id: number
  label: string
  connected?: number
}

const nodes1 = ref<Node[]>([])
const nodes2 = ref<Node[]>([])

const activeNodes = ref<Node[]>([])
const nodeRefs = ref<{ [key: string]: VNode | null }>({});
// const svgPath = ref<string>(''); // Path 정보를 저장
// const svgRef = ref<SVGSVGElement | null>(null); // SVG 요소에 대한 참조


function setNodeRef (id: number, el: VNode | null) {
  nodeRefs.value[String(id)] = el;
};

function isSelected (node: Node) {
  return activeNodes.value.includes(node)
}

function isConnected (node: Node, type: string) {
  return node.connected !== undefined ? type : (isSelected(node) ? type : 'tertiary')
}


// const getElementPosition = (el: HTMLElement) => {
//   const rect = el.getBoundingClientRect();
//   return {
//     x: rect.left + window.scrollX,
//     y: rect.top + window.scrollY
//   };
// };

// // SVG 컨테이너의 상대적 좌표를 계산합니다
// const getSVGPosition = (svg: SVGSVGElement) => {
//   const rect = svg.getBoundingClientRect();
//   return {
//     x: rect.left + window.scrollX,
//     y: rect.top + window.scrollY
//   };
// };

// const drawPathBetweenNodes = (node1: Node, node2: Node) => {
//   const node1El = nodeRefs.value[String(node1.id)] as HTMLElement | null;
//   const node2El = nodeRefs.value[String(node2.id)] as HTMLElement | null;
//   const svg = svgRef.value;

//   if (!node1El || !node2El || !svg) return;

//   const node1Pos = getElementPosition(node1El);
//   const node2Pos = getElementPosition(node2El);
//   const svgPos = getSVGPosition(svg);

//   const svgX1 = node1Pos.x - svgPos.x;
//   const svgY1 = node1Pos.y - svgPos.y;
//   const svgX2 = node2Pos.x - svgPos.x;
//   const svgY2 = node2Pos.y - svgPos.y;

//   svgPath.value = `M ${svgX1} ${svgY1} L ${svgX2} ${svgY2}`;
// };

function handleNodeClickEvent (node: Node) {
  // 이미 연결된 노드를 눌렀을 때는 기존 연결 해제
  if (node.connected !== undefined) {
    
    nodes2.value.forEach((n: Node) => {
      if (n.id === node.connected) {
        n.connected = undefined
        node.connected = undefined
      }
    })

    return
  }

  activeNodes.value.push(node)

  if (activeNodes.value.length === 2) {
    activeNodes.value[0].connected = activeNodes.value[1].id
    activeNodes.value[1].connected = activeNodes.value[0].id
    
    // const [node1, node2] = activeNodes.value
    // drawPathBetweenNodes(node1, node2);
    // console.log(node.id,  'd?')

    activeNodes.value = []
  }
}

function showConnectedStatus (): string[] {
  const result: string[] = []
  for (const node of nodes1.value) {
    if (node.connected) {
      result.push(`${node.label} → ${nodes2.value[node.connected].label}`)
    }
  }

  return result
}

watch(
  () => standardColunms.value,
  (newValue: Node[]) => {
    nodes1.value = newValue
  }
)

watch(
  () => restColunms.value,
  (newValue: Node[]) => {
    nodes2.value = newValue
  }
)
</script>

<style lang="scss" scoped>
.column-area {
  border: 1px solid #d9d9d9;
  flex: 0 0 800px;
  padding: 20px;
  border-radius: 10px;
}
</style>