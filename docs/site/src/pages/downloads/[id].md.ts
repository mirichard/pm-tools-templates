import type { APIRoute } from 'astro';
import { templates } from '../../data/templates';

export function getStaticPaths() {
  return templates.map(template => ({ params: { id: template.id }, props: { template } }));
}

export const GET: APIRoute = ({ props }) => new Response(props.template.content, {
  headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
});
