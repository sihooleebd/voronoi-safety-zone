import Co from './constant';
import Voronoi from './rhill-voronoi-core.js';
document.addEventListener('DOMContentLoaded', () => {
  new SafetyZone();
});

type Point = {
  x: number;
  y: number;
};
type Girlfriend = {
  idx: number;
  address: string;
  backgroundColor: string;
  latitude: number;
  longitude: number;
  pointOnCanvas: Point;
};

const colors = [
  '#FF000050',
  '#ffff0050',
  '#00ff0050',
  '#00FFff50',
  '#0000FF50',
  '#FF00ff50',
];

class SafetyZone {
  voronoi = new Voronoi();
  girlfriends: Girlfriend[] = [];
  nextIdx = 6;

  bbox = { xl: 0, xr: Co.CANVAS_WIDTH, yt: 0, yb: Co.CANVAS_HEIGHT };
  canvas = document.querySelector('.canvas') as HTMLCanvasElement;
  constructor() {
    this.canvas.width = Co.CANVAS_WIDTH;
    this.canvas.height = Co.CANVAS_HEIGHT;
    this.initializeGirlfriends().then(() => {
      console.log('initializeGrilfriends end');
      this.updateDiagram();
    });
  }

  async initializeGirlfriends() {
    const girlfriends: Girlfriend[] = [
      {
        idx: 1,
        address: '분당구 장안로51번길 31',
        backgroundColor: colors[0],
        latitude: 0,
        longitude: 0,
        pointOnCanvas: { x: 0, y: 0 },
      },
      {
        idx: 2,
        address: '분당구 중앙공원로 54',
        backgroundColor: colors[0],
        latitude: 0,
        longitude: 0,
        pointOnCanvas: { x: 0, y: 0 },
      },
      {
        idx: 3,
        address: '분당구 중앙공원로 53',
        backgroundColor: colors[0],
        latitude: 0,
        longitude: 0,
        pointOnCanvas: { x: 0, y: 0 },
      },
      {
        idx: 4,
        address: '분당구 내정로 186',
        backgroundColor: colors[0],
        latitude: 0,
        longitude: 0,
        pointOnCanvas: { x: 0, y: 0 },
      },
      {
        idx: 5,
        address: '분당구 정자로 112',
        backgroundColor: colors[0],
        latitude: 0,
        longitude: 0,
        pointOnCanvas: { x: 0, y: 0 },
      },
    ];
    for (const girlfriend of girlfriends) {
      await this.appendNewGirlfriend(girlfriend);
    }

    this.girlfriends = girlfriends;
    console.log(
      'sites1=',
      this.girlfriends.map((g) => g.pointOnCanvas),
    );
    this.appendBlankGirlfriend();
  }

  appendBlankGirlfriend() {
    const template = document.querySelector(
      '#input-form',
    ) as HTMLTemplateElement;
    const liContent = document.importNode(template.content, true);
    console.log('liContent=', liContent);
    const liElement = document.createElement('li');
    liElement.appendChild(liContent);

    console.log(liElement);
    liElement.dataset.idx = String(this.nextIdx);
    this.nextIdx += 1;
    const startButtonElement = liElement.querySelector('.start-dating');
    startButtonElement?.addEventListener('click', () =>
      this.onStartDating(liElement),
    );
    const endButtonElement = liElement.querySelector('.break-up');
    endButtonElement?.addEventListener('click', () =>
      this.onBreakUp(Number(liElement.dataset.idx)),
    );
    const ul = document.querySelector('ul.girlfriends');
    ul?.appendChild(liElement);
  }

  appendNewGirlfriend = async (girlfriend: Girlfriend) => {
    //step 1 , 인풋폼에 에 보여주기
    const template = document.querySelector(
      '#input-form',
    ) as HTMLTemplateElement;
    const liContent = document.importNode(template.content, true);
    console.log('liContent=', liContent);
    const liElement = document.createElement('li');
    liElement.appendChild(liContent);
    const inputElement = liElement.querySelector(
      '.address',
    ) as HTMLInputElement;
    inputElement.value = girlfriend.address;
    liElement.classList.add('going-out');
    console.log(liElement);
    const buttonElement = liElement.querySelector('.break-up');
    liElement.dataset.idx = String(girlfriend.idx);
    buttonElement?.addEventListener('click', () =>
      this.onBreakUp(girlfriend.idx),
    );

    const ul = document.querySelector('ul.girlfriends');
    ul?.appendChild(liElement);

    // step2 좌표 따기
    await this.getPosition(girlfriend);
    console.log(
      'sites2=',
      this.girlfriends.map((g) => g.pointOnCanvas),
    );
  };

  getPosition(girlfriend: Girlfriend): Promise<void> {
    const geocoder = new kakao.maps.services.Geocoder();
    const address = girlfriend.address;
    return new Promise<void>((resolve, rejejct) => {
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const { x, y } = result[0];
          console.log('보낸 주소', address);
          console.log('회신된 정보', result);
          console.log('경도', x, '위도', y);

          console.log(address, x, y);
          girlfriend.latitude = Number(y);
          girlfriend.longitude = Number(x);
          girlfriend.pointOnCanvas = {
            x: this.convertLongToX(girlfriend.longitude),
            y: this.convertLatToY(girlfriend.latitude),
          };
          console.log('girlfriend=', girlfriend);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  onBreakUp = (idx: number) => {
    console.log('break up', idx);
    this.girlfriends = this.girlfriends.filter((g) => g.idx !== idx);
    this.updateDiagram();

    const ulElement = document.querySelector('ul.girlfriends');
    if (!ulElement) {
      return;
    }
    for (let i = 0; i < ulElement.children.length; ++i) {
      if (
        Number((ulElement.children[i] as HTMLLIElement).dataset.idx) === idx
      ) {
        ulElement.children[i].remove();
        break;
      }
    }
  };

  onStartDating = async (liElement: HTMLLIElement) => {
    console.log('start dating');
    const inputElement = liElement.querySelector(
      '.address',
    ) as HTMLInputElement;
    const curIdx = Number(liElement.dataset.idx);

    const girlfriendToAdd: Girlfriend = {
      idx: curIdx,
      address: inputElement.value,
      backgroundColor: colors[0],
      latitude: 0,
      longitude: 0,
      pointOnCanvas: { x: 0, y: 0 },
    };
    await this.getPosition(girlfriendToAdd);
    if (
      girlfriendToAdd.latitude === 0 ||
      girlfriendToAdd.longitude === 0 ||
      girlfriendToAdd.pointOnCanvas.x < 0 ||
      girlfriendToAdd.pointOnCanvas.y < 0 ||
      girlfriendToAdd.pointOnCanvas.x >= Co.CANVAS_WIDTH ||
      girlfriendToAdd.pointOnCanvas.y >= Co.CANVAS_HEIGHT
    ) {
      alert('우리동내 사람과만 사귀어주세요!!!!!!!!!!!!!!!!!!');
      return;
    }
    this.girlfriends.push(girlfriendToAdd);
    this.updateDiagram();

    //왼 UI update
    liElement.classList.add('going-out');
    this.appendBlankGirlfriend();
  };

  convertLongToX(longitude: number) {
    return Co.loCoefficientA * longitude + Co.loCoefficientB;
  }
  convertLatToY(latitude: number) {
    return Co.laCoefficientA * latitude + Co.laCoefficientB;
  }
  updateDiagram() {
    console.log('this.voronoi=', this.voronoi);
    // 가로세로 위치의 배열 만들기
    const sites = this.girlfriends.map((g) => g.pointOnCanvas);
    // 라이브러리로부터 도형 얻기
    const diagram = this.voronoi.compute(sites, this.bbox);
    // 화면에 그리기
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, Co.CANVAS_WIDTH, Co.CANVAS_HEIGHT);
    diagram.cells.forEach((cell: any, i: number) => {
      //fill
      ctx.beginPath();
      const halfEdges = cell.halfedges;
      console.log('halfEdges = ', halfEdges);
      if (!halfEdges) {
        return;
      }
      const halfEdgeCount = halfEdges.length;
      let v = halfEdges[0].getStartpoint();
      console.log('v=', v);
      ctx.moveTo(v.x, v.y);
      for (let i = 0; i < halfEdgeCount; ++i) {
        v = halfEdges[i].getEndpoint();
        ctx.lineTo(v.x, v.y);
      }
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.beginPath();
      cell.halfedges.forEach((halfEdge: any) => {
        ctx.moveTo(halfEdge.edge.va.x, halfEdge.edge.va.y);
        ctx.lineTo(halfEdge.edge.vb.x, halfEdge.edge.vb.y);
      });
      // ctx.fillStyle = colors[i % 1];
      ctx.lineWidth = 5;
      ctx.stroke();
    });
    sites.forEach((point) => {
      ctx.beginPath();
      console.log(point.x, point.y);
      ctx.fillStyle = '#f00';
      ctx.arc(point.x, point.y, 15, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}
